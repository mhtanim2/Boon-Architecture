import { BOON_DATASOURCE } from '@boon/backend/database';
import { BoonStatiArticoliEntity } from '@boon/backend/database/entities/boon';
import { UpdateStatoArticolo, User } from '@boon/interfaces/boon-api';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, PaginateConfig, PaginateQuery, paginate } from 'nestjs-paginate';
import { Repository } from 'typeorm';
import { runInTransaction } from 'typeorm-transactional';

@Injectable()
export class StatiArticoliService {
  private readonly logger = new Logger(StatiArticoliService.name);

  constructor(
    @InjectRepository(BoonStatiArticoliEntity, BOON_DATASOURCE)
    private readonly statiArticoliRepository: Repository<BoonStatiArticoliEntity>
  ) {}

  async findStatiArticoli(query: PaginateQuery) {
    const findPaginateConfig: PaginateConfig<BoonStatiArticoliEntity> = {
      sortableColumns: ['id', 'nome', 'descrizione'],
      searchableColumns: ['nome', 'descrizione'],
      defaultSortBy: [
        ['id', 'ASC'],
        ['nome', 'ASC'],
        ['descrizione', 'ASC'],
      ],
      defaultLimit: 0,
      maxLimit: 0,
      filterableColumns: {
        id: [FilterOperator.EQ, FilterOperator.IN],
        nome: Object.values(FilterOperator),
        descrizione: Object.values(FilterOperator),
      },
      relativePath: true,
    };
    query.limit ??= 0;

    return await paginate(query, this.statiArticoliRepository, findPaginateConfig);
  }

  async findOneStatoArticoliById(statoId: number) {
    const entity = await this.statiArticoliRepository.findOneBy({ id: statoId });
    if (!entity) throw new NotFoundException();
    return entity;
  }

  async updateStatoArticolo(user: User, statoArticoloId: number, dto: UpdateStatoArticolo) {
    try {
      return await runInTransaction(
        async () => {
          const statoArticolo = await this.statiArticoliRepository.findOne({
            where: { id: statoArticoloId },
          });
          if (!statoArticolo) throw new NotFoundException();

          if (dto.descrizione !== undefined && dto.descrizione !== statoArticolo.descrizione) {
            statoArticolo.descrizione = dto.descrizione;
          }

          await this.statiArticoliRepository.save(statoArticolo);

          return await this.findOneStatoArticoliById(statoArticolo.id);
        },
        { connectionName: BOON_DATASOURCE }
      );
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
