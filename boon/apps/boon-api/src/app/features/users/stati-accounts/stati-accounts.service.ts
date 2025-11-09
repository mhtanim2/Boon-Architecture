import { BOON_DATASOURCE } from '@boon/backend/database';
import { BoonStatiAccountsEntity } from '@boon/backend/database/entities/boon';
import { UpdateStatoAccount, User } from '@boon/interfaces/boon-api';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, PaginateConfig, PaginateQuery, paginate } from 'nestjs-paginate';
import { Repository } from 'typeorm';
import { runInTransaction } from 'typeorm-transactional';

@Injectable()
export class StatiAccountsService {
  private readonly logger = new Logger(StatiAccountsService.name);

  constructor(
    @InjectRepository(BoonStatiAccountsEntity, BOON_DATASOURCE)
    private readonly statiAccountsRepository: Repository<BoonStatiAccountsEntity>
  ) {}

  async findStatiAccounts(query: PaginateQuery) {
    const findPaginateConfig: PaginateConfig<BoonStatiAccountsEntity> = {
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

    return await paginate(query, this.statiAccountsRepository, findPaginateConfig);
  }

  async findOneStatoAccountsById(statoId: number) {
    const entity = await this.statiAccountsRepository.findOneBy({ id: statoId });
    if (!entity) throw new NotFoundException();
    return entity;
  }

  async updateStatoAccount(user: User, statoAccountId: number, dto: UpdateStatoAccount) {
    try {
      return await runInTransaction(
        async () => {
          const statoAccount = await this.statiAccountsRepository.findOne({
            where: { id: statoAccountId },
          });
          if (!statoAccount) throw new NotFoundException();

          if (dto.descrizione !== undefined && dto.descrizione !== statoAccount.descrizione) {
            statoAccount.descrizione = dto.descrizione;
          }

          await this.statiAccountsRepository.save(statoAccount);

          return await this.findOneStatoAccountsById(statoAccount.id);
        },
        { connectionName: BOON_DATASOURCE }
      );
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
