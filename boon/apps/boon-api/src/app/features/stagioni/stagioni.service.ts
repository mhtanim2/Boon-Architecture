import { BOON_DATASOURCE } from '@boon/backend/database';
import { BoonStagioniEntity } from '@boon/backend/database/entities/boon';
import { UpdateStagione, User } from '@boon/interfaces/boon-api';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, PaginateConfig, PaginateQuery, paginate } from 'nestjs-paginate';
import { Repository } from 'typeorm';
import { runInTransaction } from 'typeorm-transactional';

@Injectable()
export class StagioniService {
  private readonly logger = new Logger(StagioniService.name);

  constructor(
    @InjectRepository(BoonStagioniEntity, BOON_DATASOURCE)
    private readonly stagioniRepository: Repository<BoonStagioniEntity>
  ) {}

  async findStagioni(query: PaginateQuery) {
    const findPaginateConfig: PaginateConfig<BoonStagioniEntity> = {
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
        codice: Object.values(FilterOperator),
        nome: Object.values(FilterOperator),
      },
      relativePath: true,
    };
    query.limit ??= 0;

    return await paginate(query, this.stagioniRepository, findPaginateConfig);
  }

  async findOneStagioneById(stagioneId: number) {
    const entity = await this.stagioniRepository.findOneBy({ id: stagioneId });
    if (!entity) throw new NotFoundException();
    return entity;
  }

  async updateStagione(user: User, stagioneId: number, dto: UpdateStagione) {
    try {
      return await runInTransaction(
        async () => {
          const stagione = await this.stagioniRepository.findOne({
            where: { id: stagioneId },
          });
          if (!stagione) throw new NotFoundException();

          if (dto.codice !== undefined && dto.codice !== stagione.codice) {
            stagione.codice = dto.codice;
          }

          if (dto.nome !== undefined && dto.nome !== stagione.nome) {
            stagione.nome = dto.nome;
          }

          await this.stagioniRepository.save(stagione);

          return await this.findOneStagioneById(stagione.id);
        },
        { connectionName: BOON_DATASOURCE }
      );
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
