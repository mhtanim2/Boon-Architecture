import { BOON_DATASOURCE } from '@boon/backend/database';
import { BoonStatiRevisioniEntity } from '@boon/backend/database/entities/boon';
import { UpdateStatoRevisione, User } from '@boon/interfaces/boon-api';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, PaginateConfig, PaginateQuery, paginate } from 'nestjs-paginate';
import { Repository } from 'typeorm';
import { runInTransaction } from 'typeorm-transactional';

@Injectable()
export class StatiRevisioniService {
  private readonly logger = new Logger(StatiRevisioniService.name);

  constructor(
    @InjectRepository(BoonStatiRevisioniEntity, BOON_DATASOURCE)
    private readonly statiRevisioniRepository: Repository<BoonStatiRevisioniEntity>
  ) {}

  async findStatiRevisioni(query: PaginateQuery) {
    const findPaginateConfig: PaginateConfig<BoonStatiRevisioniEntity> = {
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

    return await paginate(query, this.statiRevisioniRepository, findPaginateConfig);
  }

  async findOneStatoRevisioniById(statoId: number) {
    const entity = await this.statiRevisioniRepository.findOneBy({ id: statoId });
    if (!entity) throw new NotFoundException();
    return entity;
  }

  async updateStatoRevisione(user: User, statoRevisioneId: number, dto: UpdateStatoRevisione) {
    try {
      return await runInTransaction(
        async () => {
          const statoRevisione = await this.statiRevisioniRepository.findOne({
            where: { id: statoRevisioneId },
          });
          if (!statoRevisione) throw new NotFoundException();

          if (dto.descrizione !== undefined && dto.descrizione !== statoRevisione.descrizione) {
            statoRevisione.descrizione = dto.descrizione;
          }

          await this.statiRevisioniRepository.save(statoRevisione);

          return await this.findOneStatoRevisioniById(statoRevisione.id);
        },
        { connectionName: BOON_DATASOURCE }
      );
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
