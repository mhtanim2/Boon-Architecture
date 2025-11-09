import { BOON_DATASOURCE } from '@boon/backend/database';
import { BoonRuoliEntity } from '@boon/backend/database/entities/boon';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, PaginateConfig, PaginateQuery, paginate } from 'nestjs-paginate';
import { Repository } from 'typeorm';

@Injectable()
export class RuoliService {
  constructor(
    @InjectRepository(BoonRuoliEntity, BOON_DATASOURCE)
    private readonly ruoliRepository: Repository<BoonRuoliEntity>
  ) {}

  async findRuoli(query: PaginateQuery) {
    const findPaginateConfig: PaginateConfig<BoonRuoliEntity> = {
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

    return await paginate(query, this.ruoliRepository, findPaginateConfig);
  }

  async findOneRuoloById(statoId: number) {
    const entity = await this.ruoliRepository.findOneBy({
      id: statoId,
    });
    if (!entity) throw new NotFoundException();
    return entity;
  }
}
