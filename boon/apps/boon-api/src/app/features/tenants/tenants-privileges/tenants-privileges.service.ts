import { BOON_DATASOURCE } from '@boon/backend/database';
import { BoonLivelliPrivilegiEntity, BoonPrivilegiEntity } from '@boon/backend/database/entities/boon';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { chain } from 'lodash';
import { FilterOperator, PaginateConfig, PaginateQuery, paginate } from 'nestjs-paginate';
import { Repository } from 'typeorm';

@Injectable()
export class TenantsPrivilegesService {
  constructor(
    @InjectRepository(BoonPrivilegiEntity, BOON_DATASOURCE)
    private readonly privilegiRepository: Repository<BoonPrivilegiEntity>,
    @InjectRepository(BoonLivelliPrivilegiEntity, BOON_DATASOURCE)
    private readonly livelliPrivilegiRepository: Repository<BoonLivelliPrivilegiEntity>
  ) {}

  async getPrivilegesByRoles(clienteId: number, query: PaginateQuery) {
    const findPaginateConfig: PaginateConfig<BoonPrivilegiEntity> = {
      relations: {
        funzionalita: { funzionalitaClienti: true },
        ruolo: true,
        livello: true,
      },
      sortableColumns: ['funzionalita.id', 'funzionalita.nome'],
      searchableColumns: ['funzionalita.id', 'funzionalita.nome', 'funzionalita.descrizione'],
      defaultSortBy: [
        ['funzionalita.id', 'ASC'],
        ['funzionalita.nome', 'ASC'],
      ],
      defaultLimit: 0,
      maxLimit: 0,
      filterableColumns: {
        'funzionalita.id': [FilterOperator.EQ, FilterOperator.IN],
        'funzionalita.nome': Object.values(FilterOperator),
        'ruolo.id': [FilterOperator.EQ, FilterOperator.IN],
      },
      relativePath: true,
    };
    query.limit ??= 0;

    const qb = this.privilegiRepository
      .createQueryBuilder('privilegi')
      .leftJoinAndSelect('privilegi.funzionalita', 'funzionalita')
      .innerJoinAndSelect('privilegi.ruolo', 'ruolo')
      .innerJoinAndSelect('privilegi.livello', 'livello')
      .innerJoin('funzionalita.funzionalitaClienti', 'funzionalitaClienti')
      .where('privilegi.idCliente = :idCliente')
      .andWhere('funzionalitaClienti.idCliente = :idCliente')
      .setParameters({ idCliente: clienteId });

    query.limit ??= 0;

    const { data } = await paginate(query, qb, findPaginateConfig);
    const privileges = chain(data)
      .groupBy((x) => x.ruolo.id)
      .map((group) => ({
        ruolo: group[0].ruolo,
        privilegi: group.map((privilegio) => ({
          idFunzionalita: privilegio.idFunzionalita,
          idLivello: privilegio.idLivello,
          flagAbilitata: true,
          codiceFunzionalita: privilegio.funzionalita.nome,
          funzionalita: privilegio.funzionalita.descrizione,
          livello: privilegio.livello.nome,
        })),
      }))
      .value();

    return privileges;
  }

  async getPermissionsLevels() {
    const permissionsLevels = await this.livelliPrivilegiRepository.find();
    return permissionsLevels;
  }
}
