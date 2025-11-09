import { BOON_DATASOURCE } from '@boon/backend/database';
import { BoonClientiEntity, BoonLuoghiEntity, BoonTenantsEntity } from '@boon/backend/database/entities/boon';
import { CreateCliente, UpdateCliente, User } from '@boon/interfaces/boon-api';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, PaginateConfig, PaginateQuery, paginate } from 'nestjs-paginate';
import { Repository } from 'typeorm';
import { runInTransaction } from 'typeorm-transactional';
import { findOneByIdOrFail } from '../../../typeorm/find-by-or-fail';
import { clientiManyDefaultRelations, clientiOneDefaultRelations } from './clienti.orm';
import { ClientiValidationService } from './clienti.validation';

@Injectable()
export class ClientiService {
  private readonly logger = new Logger(ClientiService.name);

  constructor(
    @InjectRepository(BoonClientiEntity, BOON_DATASOURCE)
    private readonly clientiRepository: Repository<BoonClientiEntity>,
    @InjectRepository(BoonTenantsEntity, BOON_DATASOURCE)
    private readonly tenantsRepository: Repository<BoonTenantsEntity>,
    @InjectRepository(BoonLuoghiEntity, BOON_DATASOURCE)
    private readonly luoghiRepository: Repository<BoonLuoghiEntity>,
    private readonly clientiValidationService: ClientiValidationService
  ) {}

  async findClienti(query: PaginateQuery) {
    const findPaginateConfig: PaginateConfig<BoonClientiEntity> = {
      relations: clientiManyDefaultRelations,
      sortableColumns: ['id', 'ragioneSociale', 'codiceFiscale', 'tenant.slug', 'flagInterno'],
      searchableColumns: ['id', 'ragioneSociale', 'codiceFiscale', 'tenant.slug'],
      defaultSortBy: [['ragioneSociale', 'ASC']],
      defaultLimit: 0,
      maxLimit: 0,
      filterableColumns: {
        id: [FilterOperator.EQ, FilterOperator.IN],
        ragioneSociale: Object.values(FilterOperator),
        partitaIva: Object.values(FilterOperator),
        codiceFiscale: Object.values(FilterOperator),
        codiceSdi: Object.values(FilterOperator),
        pec: Object.values(FilterOperator),
        indirizzo: Object.values(FilterOperator),
        cap: Object.values(FilterOperator),
        telefono: Object.values(FilterOperator),
        eMail: Object.values(FilterOperator),
        web: Object.values(FilterOperator),
        flagInterno: [FilterOperator.EQ, FilterOperator.IN],
        'luogo.codice': [FilterOperator.EQ, FilterOperator.IN],
        'tenant.slug': Object.values(FilterOperator),
      },
      relativePath: true,
    };
    query.limit ??= 0;

    return await paginate(query, this.clientiRepository, findPaginateConfig);
  }

  async getOneClienteById(clienteId: number) {
    const cliente = await this.clientiRepository.findOne({
      relations: clientiOneDefaultRelations,
      where: { id: clienteId },
    });
    if (!cliente) throw new NotFoundException();

    return cliente;
  }

  async createCliente(user: User, dto: CreateCliente) {
    try {
      const now = new Date();

      return await runInTransaction(
        async () => {
          await this.clientiValidationService.checkPreValidity(undefined, dto);

          const cliente = this.clientiRepository.create({
            ragioneSociale: dto.ragioneSociale,
            partitaIva: dto.partitaIva,
            codiceFiscale: dto.codiceFiscale,
            codiceSdi: dto.codiceSdi,
            pec: dto.pec,
            indirizzo: dto.indirizzo,
            cap: dto.cap,
            luogo: dto.luogo ? await findOneByIdOrFail(this.luoghiRepository, 'codice', dto.luogo.codice) : undefined,
            telefono: dto.telefono,
            eMail: dto.eMail,
            web: dto.web,
            flagInterno: dto.flagInterno,
          });
          await this.clientiRepository.save(cliente);

          const tenant = this.tenantsRepository.create({
            idCliente: cliente.id,
            slug: dto.tenant.slug,
            logo: dto.tenant.logo,
          });
          await this.tenantsRepository.save(tenant);

          return await this.getOneClienteById(cliente.id);
        },
        { connectionName: BOON_DATASOURCE }
      );
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async updateCliente(user: User, clienteId: number, dto: UpdateCliente) {
    try {
      const now = new Date();

      return await runInTransaction(
        async () => {
          const cliente = await this.clientiRepository.findOne({
            relations: clientiOneDefaultRelations,
            where: { id: clienteId },
          });
          if (!cliente) throw new NotFoundException();

          await this.clientiValidationService.checkPreValidity(clienteId, dto);

          if (dto.ragioneSociale !== undefined && dto.ragioneSociale !== cliente.ragioneSociale) {
            cliente.ragioneSociale = dto.ragioneSociale;
          }
          if (dto.partitaIva !== undefined && dto.partitaIva !== cliente.partitaIva) {
            cliente.partitaIva = dto.partitaIva;
          }
          if (dto.codiceFiscale !== undefined && dto.codiceFiscale !== cliente.codiceFiscale) {
            cliente.codiceFiscale = dto.codiceFiscale;
          }
          if (dto.codiceSdi !== undefined && dto.codiceSdi !== cliente.codiceSdi) {
            cliente.codiceSdi = dto.codiceSdi;
          }
          if (dto.pec !== undefined && dto.pec !== cliente.pec) {
            cliente.pec = dto.pec;
          }
          if (dto.indirizzo !== undefined && dto.indirizzo !== cliente.indirizzo) {
            cliente.indirizzo = dto.indirizzo;
          }
          if (dto.cap !== undefined && dto.cap !== cliente.cap) {
            cliente.cap = dto.cap;
          }
          if (dto.luogo?.codice !== undefined && dto.luogo.codice !== cliente.codiceLuogo) {
            cliente.luogo = await findOneByIdOrFail(this.luoghiRepository, 'codice', dto.luogo.codice);
            cliente.codiceLuogo = dto.luogo.codice;
          }
          if (dto.telefono !== undefined && dto.telefono !== cliente.telefono) {
            cliente.telefono = dto.telefono;
          }
          if (dto.eMail !== undefined && dto.eMail !== cliente.eMail) {
            cliente.eMail = dto.eMail;
          }
          if (dto.web !== undefined && dto.web !== cliente.web) {
            cliente.web = dto.web;
          }
          if (dto.flagInterno !== undefined && dto.flagInterno !== cliente.flagInterno) {
            cliente.flagInterno = dto.flagInterno;
          }

          if (dto.tenant?.slug !== undefined && dto.tenant.slug !== cliente.tenant.slug) {
            cliente.tenant.slug = dto.tenant.slug;
          }
          if (dto.tenant?.logo !== undefined && dto.tenant.logo !== cliente.tenant.logo) {
            cliente.tenant.logo = dto.tenant.logo;
          }

          await this.clientiRepository.save(cliente);

          await this.tenantsRepository.save(cliente.tenant);

          return await this.getOneClienteById(cliente.id);
        },
        { connectionName: BOON_DATASOURCE }
      );
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
