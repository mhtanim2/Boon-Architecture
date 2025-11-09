import { BOON_DATASOURCE } from '@boon/backend/database';
import { BoonStagioniClientiEntity, BoonStagioniEntity } from '@boon/backend/database/entities/boon';
import { CreateStagioneCliente, Tenant, UpdateStagioneCliente, User } from '@boon/interfaces/boon-api';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, PaginateConfig, PaginateQuery, paginate } from 'nestjs-paginate';
import { Repository } from 'typeorm';
import { runInTransaction } from 'typeorm-transactional';
import { findOneByIdOrFail } from '../../../typeorm/find-by-or-fail';

@Injectable()
export class StagioniClientiService {
  private readonly logger = new Logger(StagioniClientiService.name);

  constructor(
    @InjectRepository(BoonStagioniClientiEntity, BOON_DATASOURCE)
    private readonly stagioniClientiRepository: Repository<BoonStagioniClientiEntity>,
    @InjectRepository(BoonStagioniEntity, BOON_DATASOURCE)
    private readonly stagioniRepository: Repository<BoonStagioniEntity>
  ) {}

  async findStagioniClienti(tenant: Tenant, query: PaginateQuery) {
    const findPaginateConfig: PaginateConfig<BoonStagioniClientiEntity> = {
      relations: { stagione: true },
      sortableColumns: ['id', 'codice', 'nome'],
      searchableColumns: ['codice', 'nome'],
      defaultSortBy: [
        ['id', 'ASC'],
        ['codice', 'ASC'],
        ['nome', 'ASC'],
      ],
      defaultLimit: 0,
      maxLimit: 0,
      filterableColumns: {
        id: [FilterOperator.EQ, FilterOperator.IN],
        idStagione: [FilterOperator.EQ, FilterOperator.IN],
        codice: Object.values(FilterOperator),
        nome: Object.values(FilterOperator),
      },
      relativePath: true,
      where: {
        idCliente: tenant.cliente.id,
      },
    };
    query.limit ??= 0;

    return await paginate(query, this.stagioniClientiRepository, findPaginateConfig);
  }

  async findOneStagioneClienteById(tenant: Tenant, stagioneClienteId: number) {
    const entity = await this.stagioniClientiRepository.findOne({
      relations: { stagione: true },
      where: {
        id: stagioneClienteId,
        idCliente: tenant.cliente.id,
      },
    });
    if (!entity) throw new NotFoundException();
    return entity;
  }

  async createStagioneCliente(tenant: Tenant, user: User, dto: CreateStagioneCliente) {
    try {
      const now = new Date();

      return await runInTransaction(
        async () => {
          const stagioneCliente = this.stagioniClientiRepository.create({
            stagione: await findOneByIdOrFail(this.stagioniRepository, 'id', dto.stagione.id),
            codice: dto.codice,
            nome: dto.nome,
          });
          await this.stagioniClientiRepository.save(stagioneCliente);

          return await this.findOneStagioneClienteById(tenant, stagioneCliente.id);
        },
        { connectionName: BOON_DATASOURCE }
      );
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async updateStagioneCliente(tenant: Tenant, user: User, stagioneClienteId: number, dto: UpdateStagioneCliente) {
    try {
      return await runInTransaction(
        async () => {
          const stagioneCliente = await this.stagioniClientiRepository.findOne({
            relations: { stagione: true },
            where: { id: stagioneClienteId, idCliente: tenant.cliente.id },
          });
          if (!stagioneCliente) throw new NotFoundException();

          if (dto.stagione?.id !== undefined && dto.stagione.id !== stagioneCliente.id) {
            stagioneCliente.stagione = await findOneByIdOrFail(this.stagioniRepository, 'id', dto.stagione.id);
            stagioneCliente.idStagione = dto.stagione.id;
          }

          if (dto.codice !== undefined && dto.codice !== stagioneCliente.codice) {
            stagioneCliente.codice = dto.codice;
          }

          if (dto.nome !== undefined && dto.nome !== stagioneCliente.nome) {
            stagioneCliente.nome = dto.nome;
          }

          await this.stagioniClientiRepository.save(stagioneCliente);

          return await this.findOneStagioneClienteById(tenant, stagioneCliente.id);
        },
        { connectionName: BOON_DATASOURCE }
      );
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
