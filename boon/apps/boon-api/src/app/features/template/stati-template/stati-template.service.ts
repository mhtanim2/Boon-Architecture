import { BOON_DATASOURCE } from '@boon/backend/database';
import { BoonStatiTemplateEntity } from '@boon/backend/database/entities/boon';
import { UpdateStatoTemplate, User } from '@boon/interfaces/boon-api';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, PaginateConfig, PaginateQuery, paginate } from 'nestjs-paginate';
import { Repository } from 'typeorm';
import { runInTransaction } from 'typeorm-transactional';

@Injectable()
export class StatiTemplateService {
  private readonly logger = new Logger(StatiTemplateService.name);

  constructor(
    @InjectRepository(BoonStatiTemplateEntity, BOON_DATASOURCE)
    private readonly statiTemplateRepository: Repository<BoonStatiTemplateEntity>
  ) {}

  async findStatiTemplate(query: PaginateQuery) {
    const findPaginateConfig: PaginateConfig<BoonStatiTemplateEntity> = {
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

    return await paginate(query, this.statiTemplateRepository, findPaginateConfig);
  }

  async findOneStatoTemplateById(statoId: number) {
    const entity = await this.statiTemplateRepository.findOneBy({ id: statoId });
    if (!entity) throw new NotFoundException();
    return entity;
  }

  async updateStatoTemplate(user: User, statoTemplateId: number, dto: UpdateStatoTemplate) {
    try {
      return await runInTransaction(
        async () => {
          const statoTemplate = await this.statiTemplateRepository.findOne({
            where: { id: statoTemplateId },
          });
          if (!statoTemplate) throw new NotFoundException();

          if (dto.descrizione !== undefined && dto.descrizione !== statoTemplate.descrizione) {
            statoTemplate.descrizione = dto.descrizione;
          }

          await this.statiTemplateRepository.save(statoTemplate);

          return await this.findOneStatoTemplateById(statoTemplate.id);
        },
        { connectionName: BOON_DATASOURCE }
      );
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
