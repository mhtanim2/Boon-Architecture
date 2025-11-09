import { BOON_DATASOURCE } from '@boon/backend/database';
import {
  BoonAccountsClientiEntity,
  BoonAccountsEntity,
  BoonAccountsFunzionalitaEntity,
  BoonClientiEntity,
  BoonFunzionalitaEntity,
  BoonPrivilegiEntity,
  BoonProfiliEntity,
  BoonRuoliEntity,
  BoonStatiAccountsEntity,
} from '@boon/backend/database/entities/boon';
import { BoonGetPrivilegesSproc } from '@boon/backend/database/stored-procedures/boon';
import { dayjs } from '@boon/common/dayjs';
import { CreateUser, UpdateUser, User } from '@boon/interfaces/boon-api';
import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { chain, differenceWith, flatten, partition, pick } from 'lodash';
import { FilterOperator, PaginateConfig, PaginateQuery, paginate } from 'nestjs-paginate';
import { UrlGeneratorService } from 'nestjs-url-generator';
import { In, Repository } from 'typeorm';
import { runInTransaction } from 'typeorm-transactional';
import { findByIdsOrFail, findOneByIdOrFail } from '../../../typeorm/find-by-or-fail';
import { accountsManyDefaultRelations, accountsOneDefaultRelations } from './users.orm';
import { UsersValidationService } from './users.validation';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(BoonAccountsEntity, BOON_DATASOURCE)
    private readonly accountsRepository: Repository<BoonAccountsEntity>,
    @InjectRepository(BoonAccountsClientiEntity, BOON_DATASOURCE)
    private readonly accountsClientiRepository: Repository<BoonAccountsClientiEntity>,
    @InjectRepository(BoonStatiAccountsEntity, BOON_DATASOURCE)
    private readonly statiAccountsRepository: Repository<BoonStatiAccountsEntity>,
    @InjectRepository(BoonRuoliEntity, BOON_DATASOURCE)
    private readonly ruoliRepository: Repository<BoonRuoliEntity>,
    @InjectRepository(BoonAccountsFunzionalitaEntity, BOON_DATASOURCE)
    private readonly accountsFunzionalitaRepository: Repository<BoonAccountsFunzionalitaEntity>,
    @InjectRepository(BoonProfiliEntity, BOON_DATASOURCE)
    private readonly profiliRepository: Repository<BoonProfiliEntity>,
    @InjectRepository(BoonClientiEntity, BOON_DATASOURCE)
    private readonly clientiRepository: Repository<BoonClientiEntity>,
    @InjectRepository(BoonFunzionalitaEntity, BOON_DATASOURCE)
    private readonly funzionalitaRepository: Repository<BoonFunzionalitaEntity>,
    @InjectRepository(BoonPrivilegiEntity, BOON_DATASOURCE)
    private readonly privilegiRepository: Repository<BoonPrivilegiEntity>,
    private readonly usersValidationService: UsersValidationService,
    private readonly urlGeneratorService: UrlGeneratorService
  ) {}

  async findUsers(query: PaginateQuery, clienteId?: number) {
    const findPaginateConfig: PaginateConfig<BoonAccountsEntity> = {
      relations: accountsManyDefaultRelations,
      sortableColumns: [
        'id',
        'username',
        'nome',
        'cognome',
        'dataCreazione',
        'dataScadenza',
        'stato.id',
        'stato.nome',
        'cliente.id',
        'cliente.ragioneSociale',
      ],
      searchableColumns: ['nome', 'cognome', 'username'],
      defaultSortBy: [['id', 'ASC']],
      defaultLimit: 0,
      maxLimit: 0,
      filterableColumns: {
        id: [FilterOperator.EQ, FilterOperator.IN],
        cognome: Object.values(FilterOperator),
        nome: Object.values(FilterOperator),
        username: Object.values(FilterOperator),
        dataCreazione: [FilterOperator.EQ, FilterOperator.GTE, FilterOperator.LTE],
        dataScadenza: [FilterOperator.EQ, FilterOperator.GTE, FilterOperator.LTE],
        'stato.id': [FilterOperator.EQ, FilterOperator.IN],
        'cliente.id': [FilterOperator.EQ, FilterOperator.IN],
        'profili.ruolo.id': [FilterOperator.EQ, FilterOperator.IN],
      },
      relativePath: true,
    };
    query.limit ??= 0;

    return await paginate(query, this.accountsRepository, findPaginateConfig);
  }

  async findOneUserById(accountId: number) {
    const findConfig = {
      relations: accountsOneDefaultRelations,
      where: { id: accountId },
    };

    const account = await this.accountsRepository.findOne(findConfig);
    if (!account) throw new NotFoundException();

    return this.getUser(async () => account);
  }

  async createUser(user: User, dto: CreateUser) {
    try {
      const now = new Date();

      return await runInTransaction(
        async () => {
          await this.usersValidationService.checkPreValidity(dto);

          const account = this.accountsRepository.create({
            username: dto.username,
            cognome: dto.cognome,
            nome: dto.nome,
            idStato: dto.stato.id,
            idCliente: dto.cliente.id,
            flagPrimoAccesso: true,
            flagEmailVerificata: dto.flagEmailVerificata,
            flagPasswordDaCambiare: dto.flagPasswordDaCambiare,
            dataCreazione: dayjs(now).format('YYYY-MM-DD'),
          });
          await this.accountsRepository.save(account);

          const accountsClienti = dto.clienti.map((cliente) => {
            return this.accountsClientiRepository.create({
              idAccount: account.id,
              idCliente: cliente.id,
            });
          });
          account.accountsClienti = await this.accountsClientiRepository.save(accountsClienti);

          const profili = dto.ruoli.map((ruolo) => {
            return this.profiliRepository.create({
              idAccount: account.id,
              idRuolo: ruolo.id,
            });
          });
          account.profili = await this.profiliRepository.save(profili);

          const calculatedAccountsFunzionalita = flatten(
            await Promise.all(
              dto.clienti.flatMap(async (cliente) => {
                const deltaPrivileges = await this.calculateDeltaPrivileges(
                  cliente.id,
                  account.profili.map((x) => x.idRuolo),
                  cliente.privilegi
                );
                return deltaPrivileges;
              })
            )
          );
          const accountsFunzionalitaToAdd = differenceWith(
            calculatedAccountsFunzionalita,
            account.accountsFunzionalita,
            (b, a) => a.idCliente === b.idCliente && a.idFunzionalita === b.idFunzionalita
          ).map((funzionalita) => {
            return this.accountsFunzionalitaRepository.create({
              idAccount: account.id,
              idCliente: funzionalita.idCliente,
              idFunzionalita: funzionalita.idFunzionalita,
              idLivello: funzionalita.idLivello,
              flagAbilitata: funzionalita.flagAbilitata,
            });
          });
          account.accountsFunzionalita = await this.accountsFunzionalitaRepository.save(accountsFunzionalitaToAdd);

          return await this.findOneUserById(account.id);
        },
        { connectionName: BOON_DATASOURCE }
      );
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async updateUser(user: User, accountId: number, dto: UpdateUser) {
    try {
      return await runInTransaction(
        async () => {
          const account = await this.accountsRepository.findOne({
            relations: accountsOneDefaultRelations,
            where: { id: accountId },
          });
          if (!account) throw new NotFoundException();

          if (dto.cognome !== undefined && dto.cognome !== account.cognome) {
            account.cognome = dto.cognome;
          }
          if (dto.nome !== undefined && dto.nome !== account.nome) {
            account.nome = dto.nome;
          }
          if (dto.flagEmailVerificata !== undefined && dto.flagEmailVerificata !== account.flagEmailVerificata) {
            account.flagEmailVerificata = dto.flagEmailVerificata;
          }
          if (
            dto.flagPasswordDaCambiare !== undefined &&
            dto.flagPasswordDaCambiare !== account.flagPasswordDaCambiare
          ) {
            account.flagPasswordDaCambiare = dto.flagPasswordDaCambiare;
          }
          if (dto.username !== undefined && dto.username !== account.username) {
            account.username = dto.username;
            if (!dto.flagEmailVerificata) {
              await this.sendVerificationEmail(account.username);
            }
          }
          if (dto.stato !== undefined && dto.stato.id !== account.stato.id) {
            account.stato = await findOneByIdOrFail(this.statiAccountsRepository, 'id', dto.stato.id);
            account.idStato = account.stato.id;
          }
          await this.accountsRepository.save(account);

          if (dto.ruoli !== undefined) {
            await findByIdsOrFail(
              this.ruoliRepository,
              'id',
              dto.ruoli.map((x) => x.id)
            );
            const profiliToRemove = differenceWith(account.profili, dto.ruoli, (a, b) => a.idRuolo === b.id);
            const profiliToAdd = differenceWith(dto.ruoli, account.profili, (b, a) => a.idRuolo === b.id).map((ruolo) =>
              this.profiliRepository.create({
                idAccount: account.id,
                idRuolo: ruolo.id,
              })
            );
            account.profili = account.profili
              .filter((x) => !profiliToRemove.some((y) => x.id === y.id))
              .concat(profiliToAdd);
            await this.accountsRepository.save(account);
          }

          if (dto.clienti !== undefined) {
            await findByIdsOrFail(
              this.clientiRepository,
              'id',
              dto.clienti.map((x) => x.id)
            );
            await findByIdsOrFail(
              this.funzionalitaRepository,
              'id',
              dto.clienti.flatMap((x) => x.privilegi.map((x) => x.idFunzionalita))
            );
            const accountsClientiToRemove = differenceWith(
              account.accountsClienti,
              dto.clienti,
              (a, b) => a.idCliente === b.id
            );
            const accountsClientiToAdd = differenceWith(
              dto.clienti,
              account.accountsClienti,
              (b, a) => a.idCliente === b.id
            ).map((cliente) => {
              return this.accountsClientiRepository.create({
                idAccount: account.id,
                idCliente: cliente.id,
              });
            });
            account.accountsClienti = account.accountsClienti
              .filter((x) => !accountsClientiToRemove.some((y) => x.id === y.id))
              .concat(accountsClientiToAdd);
            await this.accountsRepository.save(account);

            const calculatedAccountsFunzionalita = flatten(
              await Promise.all(
                dto.clienti.flatMap(async (cliente) => {
                  const deltaPrivileges = await this.calculateDeltaPrivileges(
                    cliente.id,
                    account.profili.map((x) => x.idRuolo),
                    cliente.privilegi
                  );
                  return deltaPrivileges;
                })
              )
            );

            const accountsFunzionalitaToRemove = differenceWith(
              account.accountsFunzionalita,
              calculatedAccountsFunzionalita,
              (a, b) =>
                a.idCliente === b.idCliente && a.idFunzionalita === b.idFunzionalita && a.idLivello === b.idLivello
            );
            const accountsFunzionalitaToAdd = differenceWith(
              calculatedAccountsFunzionalita,
              account.accountsFunzionalita,
              (b, a) =>
                a.idCliente === b.idCliente && a.idFunzionalita === b.idFunzionalita && a.idLivello === b.idLivello
            ).map((funzionalita) => {
              return this.accountsFunzionalitaRepository.create({
                idAccount: account.id,
                idCliente: funzionalita.idCliente,
                idFunzionalita: funzionalita.idFunzionalita,
                idLivello: funzionalita.idLivello,
                flagAbilitata: funzionalita.flagAbilitata,
              });
            });

            account.accountsFunzionalita = account.accountsFunzionalita
              .filter((x) => !accountsFunzionalitaToRemove.some((y) => x.id === y.id))
              .concat(accountsFunzionalitaToAdd);
            await this.accountsRepository.save(account);
          }

          return await this.findOneUserById(account.id);
        },
        { connectionName: BOON_DATASOURCE }
      );
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async deleteUser(user: User, accountId: number) {
    try {
      const now = new Date();

      return await runInTransaction(
        async () => {
          const account = await this.findOneUserById(accountId);
          if (!account) throw new NotFoundException();

          await this.accountsClientiRepository.delete({ idAccount: accountId });
          await this.accountsFunzionalitaRepository.delete({ idAccount: accountId });
          await this.profiliRepository.delete({ idAccount: accountId });
          await this.accountsRepository.delete({ id: accountId });

          return account;
        },
        { connectionName: BOON_DATASOURCE }
      );
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async createEmailVerificationChallengeForUser(user: User, accountId: number) {
    try {
      return await runInTransaction(
        async () => {
          const account = await this.accountsRepository.findOne({
            relations: accountsOneDefaultRelations,
            where: { id: accountId },
          });
          if (!account) throw new NotFoundException();

          account.flagEmailVerificata = false;
          await this.accountsRepository.save(account);

          account.flagPrimoAccesso
            ? await this.sendWelcomeEmail(account.username)
            : await this.sendVerificationEmail(account.username);
        },
        { connectionName: BOON_DATASOURCE }
      );
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  private async getUser(
    accountFunc: () => Promise<BoonAccountsEntity | null>,
    clienteId?: number
  ): Promise<User | null> {
    const account = await accountFunc();
    if (!account) return null;

    const privilegi = await BoonGetPrivilegesSproc.getMany(this.accountsRepository.manager, {
      accountId: account.id,
      clienteId: undefined,
    });

    const privilegiByCliente = chain(privilegi)
      .groupBy((x) => x.idCliente)
      .value();

    let clienti = chain(account.accountsClienti)
      .flatMap((x) => ({
        ...x.cliente,
        privilegi: privilegiByCliente[x.idCliente] ?? [],
      }))
      .orderBy((x) => x.ragioneSociale)
      .value();
    clienti = flatten(partition(clienti, (x) => x.flagInterno));

    const ruoli = account.profili.flatMap((x) => x.ruolo);
    const user = { ...account, clienti, ruoli };

    return user;
  }

  async sendWelcomeEmail(username: string) {
    const url = this.urlGeneratorService.generateUrlFromPath({
      relativePath: 'auth/magic-login',
      query: {
        action: 'WELCOME',
      },
    });

    const res = await fetch(url, {
      method: `POST`,
      body: JSON.stringify({
        destination: username,
      }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new InternalServerErrorException(`Could not send welcome email`);
  }

  async sendVerificationEmail(username: string) {
    const url = this.urlGeneratorService.generateUrlFromPath({
      relativePath: 'auth/magic-login',
      query: {
        action: 'VERIFY_EMAIL',
      },
    });

    const res = await fetch(url, {
      method: `POST`,
      body: JSON.stringify({
        destination: username,
      }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new InternalServerErrorException(`Could not send verification email`);
  }

  private async getDefaultPrivileges(idCliente: number, idsRuoli: number[]) {
    const privileges = chain(
      await this.privilegiRepository.findBy({
        idCliente: idCliente,
        idRuolo: In(idsRuoli),
      })
    )
      .map((x) => pick(x, ['idFunzionalita', 'idLivello']))
      .uniq()
      .value();

    return privileges;
  }

  private async calculateDeltaPrivileges(
    idCliente: number,
    idsRuoli: number[],
    privilegi: { idFunzionalita: number; idLivello: number; flagAbilitata: boolean }[]
  ) {
    const enabledDefaultPrivileges = await this.getDefaultPrivileges(idCliente, idsRuoli);
    const [enabledPrivileges, disabledPrivileges] = partition(privilegi, (x) => x.flagAbilitata);

    const privilegesToEnable = enabledPrivileges.filter(
      (x) => !enabledDefaultPrivileges.some((y) => y.idFunzionalita === x.idFunzionalita && y.idLivello === x.idLivello)
    );
    const privilegesToDisable = disabledPrivileges.filter((x) =>
      enabledDefaultPrivileges.some((y) => y.idFunzionalita === x.idFunzionalita && y.idLivello === x.idLivello)
    );

    return [
      ...privilegesToEnable.map((x) => ({
        idCliente: idCliente,
        idFunzionalita: x.idFunzionalita,
        idLivello: x.idLivello,
        flagAbilitata: true,
      })),
      ...privilegesToDisable.map((x) => ({
        idCliente: idCliente,
        idFunzionalita: x.idFunzionalita,
        idLivello: x.idLivello,
        flagAbilitata: false,
      })),
    ];
  }
}
