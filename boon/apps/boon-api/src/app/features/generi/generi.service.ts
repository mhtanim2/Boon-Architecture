import { BOON_DATASOURCE } from '@boon/backend/database';
import { BoonGeneriAliasEntity, BoonGeneriEntity } from '@boon/backend/database/entities/boon';
import { UpdateGenere, User } from '@boon/interfaces/boon-api';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { differenceWith } from 'lodash';
import { FilterOperator, PaginateConfig, PaginateQuery, paginate } from 'nestjs-paginate';
import { Repository } from 'typeorm';
import { runInTransaction } from 'typeorm-transactional';

@Injectable()
export class GeneriService {
  private readonly logger = new Logger(GeneriService.name);

  constructor(
    @InjectRepository(BoonGeneriEntity, BOON_DATASOURCE)
    private readonly generiRepository: Repository<BoonGeneriEntity>,
    @InjectRepository(BoonGeneriAliasEntity, BOON_DATASOURCE)
    private readonly generiAliasRepository: Repository<BoonGeneriAliasEntity>
  ) {}

  async findGeneri(query: PaginateQuery) {
    const findPaginateConfig: PaginateConfig<BoonGeneriEntity> = {
      relations: { alias: true },
      sortableColumns: ['id', 'nome', 'sigla'],
      searchableColumns: ['nome', 'sigla', 'alias.alias'],
      defaultSortBy: [
        ['id', 'ASC'],
        ['nome', 'ASC'],
        ['sigla', 'ASC'],
      ],
      defaultLimit: 0,
      maxLimit: 0,
      filterableColumns: {
        id: [FilterOperator.EQ, FilterOperator.IN],
        nome: Object.values(FilterOperator),
        sigla: Object.values(FilterOperator),
        'alias.alias': Object.values(FilterOperator),
      },
      relativePath: true,
    };
    query.limit ??= 0;

    return await paginate(query, this.generiRepository, findPaginateConfig);
  }

  async findOneGenereById(genereId: number) {
    const entity = await this.generiRepository.findOne({ relations: { alias: true }, where: { id: genereId } });
    if (!entity) throw new NotFoundException();
    return entity;
  }

  async updateGenere(user: User, genereId: number, dto: UpdateGenere) {
    try {
      return await runInTransaction(
        async () => {
          const genere = await this.generiRepository.findOne({
            relations: { alias: true },
            where: { id: genereId },
          });
          if (!genere) throw new NotFoundException();

          if (dto.nome !== undefined && dto.nome !== genere.nome) {
            genere.nome = dto.nome;
          }

          if (dto.sigla !== undefined && dto.sigla !== genere.sigla) {
            genere.sigla = dto.sigla;
          }

          if (dto.alias !== undefined) {
            const aliasesToRemove = differenceWith(genere.alias, dto.alias, (a, b) => a.alias === b);
            const aliasesToAdd = differenceWith(dto.alias, genere.alias, (b, a) => a.alias === b).map((alias) => {
              return this.generiAliasRepository.create({
                idGenere: genere.id,
                alias: alias,
              });
            });
            genere.alias = genere.alias.filter((x) => !aliasesToRemove.some((y) => x.id === y.id)).concat(aliasesToAdd);
            await this.generiRepository.save(genere);
          }

          await this.generiRepository.save(genere);

          return await this.findOneGenereById(genere.id);
        },
        { connectionName: BOON_DATASOURCE }
      );
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
