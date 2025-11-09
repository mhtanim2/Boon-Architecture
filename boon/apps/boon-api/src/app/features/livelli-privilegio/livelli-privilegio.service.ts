import { BOON_DATASOURCE } from '@boon/backend/database';
import { BoonLivelliPrivilegiEntity } from '@boon/backend/database/entities/boon';
import { UpdateLivelloPrivilegio, User } from '@boon/interfaces/boon-api';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, PaginateConfig, PaginateQuery, paginate } from 'nestjs-paginate';
import { Repository } from 'typeorm';
import { runInTransaction } from 'typeorm-transactional';

@Injectable()
export class LivelliPrivilegioService {
  private readonly logger = new Logger(LivelliPrivilegioService.name);

  constructor(
    @InjectRepository(BoonLivelliPrivilegiEntity, BOON_DATASOURCE)
    private readonly livelliPrivilegiRepository: Repository<BoonLivelliPrivilegiEntity>
  ) {}

  async findLivelliPrivilegio(query: PaginateQuery) {
    const findPaginateConfig: PaginateConfig<BoonLivelliPrivilegiEntity> = {
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

    return await paginate(query, this.livelliPrivilegiRepository, findPaginateConfig);
  }

  async findOneLivelloPrivilegioById(statoId: number) {
    const entity = await this.livelliPrivilegiRepository.findOneBy({ id: statoId });
    if (!entity) throw new NotFoundException();
    return entity;
  }

  async updateLivelloPrivilegio(user: User, livelloPrivilegioId: number, dto: UpdateLivelloPrivilegio) {
    try {
      return await runInTransaction(
        async () => {
          const livelloPrivilegio = await this.livelliPrivilegiRepository.findOne({
            where: { id: livelloPrivilegioId },
          });
          if (!livelloPrivilegio) throw new NotFoundException();

          if (dto.descrizione !== undefined && dto.descrizione !== livelloPrivilegio.descrizione) {
            livelloPrivilegio.descrizione = dto.descrizione;
          }

          await this.livelliPrivilegiRepository.save(livelloPrivilegio);

          return await this.findOneLivelloPrivilegioById(livelloPrivilegio.id);
        },
        { connectionName: BOON_DATASOURCE }
      );
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
