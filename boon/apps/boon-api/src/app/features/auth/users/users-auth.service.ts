import { BOON_DATASOURCE } from '@boon/backend/database';
import { BoonAccountsEntity } from '@boon/backend/database/entities/boon';
import { BoonGetPrivilegesSproc } from '@boon/backend/database/stored-procedures/boon';
import { User } from '@boon/interfaces/boon-api';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { chain, flatten, partition } from 'lodash';
import { Repository } from 'typeorm';
import { accountsOneDefaultRelations } from '../../users/users.orm';

@Injectable()
export class UsersAuthService {
  constructor(
    @InjectRepository(BoonAccountsEntity, BOON_DATASOURCE)
    private readonly accountsRepository: Repository<BoonAccountsEntity>
  ) {}

  async getUserById(accountId: number, clienteId?: number) {
    const account = async () =>
      await this.accountsRepository.findOne({
        relations: accountsOneDefaultRelations,
        where: { id: accountId },
      });
    return this.getUser(account, clienteId);
  }

  async getUserByUsername(username: string, clienteId?: number) {
    const account = async () =>
      await this.accountsRepository.findOne({
        relations: accountsOneDefaultRelations,
        where: { username: username },
      });
    return this.getUser(account, clienteId);
  }

  private async getUser(
    accountFunc: () => Promise<BoonAccountsEntity | null>,
    clienteId?: number
  ): Promise<User | null> {
    const account = await accountFunc();
    if (!account) return null;

    const canOperateOnCliente = clienteId
      ? account.ruoli.some((x) => x.nome === 'SUPERADMIN') ||
        account.accountsClienti.some((x) => x.idCliente === clienteId)
      : true;
    if (!canOperateOnCliente) return null;

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

  async getUserByIdAndRefreshTokenPair(accountId: number, refreshToken: string, clienteId?: number) {
    const accountById = await this.getUserById(accountId, clienteId);
    if (!accountById?.ultimoHashRefreshToken) return null;

    const isRefreshTokenMatching = await bcrypt.compare(refreshToken, accountById.ultimoHashRefreshToken);
    return isRefreshTokenMatching ? accountById : null;
  }

  async setCurrentRefreshTokenHash(accountId: number, refreshToken: string | null) {
    const hash = refreshToken ? await bcrypt.hash(refreshToken, 10) : null;
    await this.accountsRepository.update(accountId, {
      ultimoHashRefreshToken: hash,
    });
  }

  async resetPassword(accountId: number, flagPasswordDaCambiare: boolean, plainTextPassword?: string) {
    await this.accountsRepository.update(accountId, {
      flagPasswordDaCambiare: flagPasswordDaCambiare,
      password: plainTextPassword ? await bcrypt.hash(plainTextPassword, 10) : undefined,
    });
  }

  async setFirstLoginFlag(accountId: number, flagPrimoAccesso: boolean) {
    await this.accountsRepository.update(accountId, {
      flagPrimoAccesso: flagPrimoAccesso,
    });
  }

  async verifyEmail(accountId: number, flagEmailVerificata: boolean) {
    await this.accountsRepository.update(accountId, {
      flagEmailVerificata: flagEmailVerificata,
    });
  }
}
