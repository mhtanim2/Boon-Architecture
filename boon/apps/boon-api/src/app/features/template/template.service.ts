import { BOON_DATASOURCE } from '@boon/backend/database';
import {
  BoonClientiEntity,
  BoonComposizioneTemplateEntity,
  BoonFunzionalitaClientiEntity,
  BoonFunzionalitaEntity,
  BoonStatiTemplateEntity,
  BoonTemplateClientiEntity,
} from '@boon/backend/database/entities/boon';
import { CreateTemplate, Tenant, UpdateTemplate, User } from '@boon/interfaces/boon-api';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { differenceWith, isEqual, omit } from 'lodash';
import { FilterOperator, PaginateConfig, PaginateQuery, paginate } from 'nestjs-paginate';
import { Repository } from 'typeorm';
import { runInTransaction } from 'typeorm-transactional';
import { findOneByIdOrFail } from '../../../typeorm/find-by-or-fail';
import { templateManyDefaultRelations, templateOneDefaultRelations } from './template.orm';
import { TemplateValidationService } from './template.validation';

@Injectable()
export class TemplateService {
  private readonly logger = new Logger(TemplateService.name);

  constructor(
    private readonly templateValidationService: TemplateValidationService,
    @InjectRepository(BoonTemplateClientiEntity, BOON_DATASOURCE)
    private readonly templateClientiRepository: Repository<BoonTemplateClientiEntity>,
    @InjectRepository(BoonComposizioneTemplateEntity, BOON_DATASOURCE)
    private readonly composizioneTemplateRepository: Repository<BoonComposizioneTemplateEntity>,
    @InjectRepository(BoonClientiEntity, BOON_DATASOURCE)
    private readonly clientiRepository: Repository<BoonClientiEntity>,
    @InjectRepository(BoonStatiTemplateEntity, BOON_DATASOURCE)
    private readonly statiTemplateRepository: Repository<BoonStatiTemplateEntity>,
    @InjectRepository(BoonFunzionalitaEntity, BOON_DATASOURCE)
    private readonly funzionalitaRepository: Repository<BoonFunzionalitaEntity>,
    @InjectRepository(BoonFunzionalitaClientiEntity, BOON_DATASOURCE)
    private readonly funzionalitaClientiRepository: Repository<BoonFunzionalitaClientiEntity>
  ) {}

  async findTemplate(tenant: Tenant, query: PaginateQuery) {
    const findPaginateConfig: PaginateConfig<BoonTemplateClientiEntity> = {
      relations: templateManyDefaultRelations,
      sortableColumns: ['id', 'stato.descrizione', 'cliente.ragioneSociale', 'funzionalita.descrizione', 'nome'],
      searchableColumns: ['stato.descrizione', 'cliente.ragioneSociale', 'funzionalita.descrizione', 'nome'],
      defaultSortBy: [
        ['id', 'ASC'],
        ['nome', 'ASC'],
      ],
      defaultLimit: 0,
      maxLimit: 0,
      filterableColumns: {
        id: [FilterOperator.EQ, FilterOperator.IN],
        'cliente.id': [FilterOperator.EQ, FilterOperator.IN],
        'stato.id': [FilterOperator.EQ, FilterOperator.IN],
        'funzionalita.id': [FilterOperator.EQ, FilterOperator.IN],
        nome: Object.values(FilterOperator),
      },
      relativePath: true,
      where: {
        idCliente: tenant.cliente.id,
      },
    };
    query.limit ??= 0;

    return await paginate(query, this.templateClientiRepository, { ...findPaginateConfig });
  }

  async findOneTemplateById(tenant: Tenant, templateId: number) {
    const entity = await this.templateClientiRepository.findOne({
      relations: templateOneDefaultRelations,
      where: { id: templateId, idCliente: tenant.cliente.id },
    });
    if (!entity) throw new NotFoundException();
    return entity;
  }

  async createTemplate(tenant: Tenant, user: User, dto: CreateTemplate) {
    try {
      const now = new Date();
      return await runInTransaction(
        async () => {
          await this.templateValidationService.checkPreValidity(undefined, tenant.cliente.id, dto);

          const template = this.templateClientiRepository.create({
            cliente: await findOneByIdOrFail(this.clientiRepository, 'id', tenant.cliente.id),
            stato: await findOneByIdOrFail(this.statiTemplateRepository, 'id', dto.stato.id),
            funzionalita: await findOneByIdOrFail(this.funzionalitaRepository, 'id', dto.funzionalita.id),
            nome: dto.nome,
          });
          await this.templateClientiRepository.save(template);

          const composizione = dto.composizione.map((regola) => {
            return this.composizioneTemplateRepository.create({
              idTemplate: template.id,
              nomeColonna: regola.nomeColonna,
              tipoDati: regola.tipoDati,
              lunghezzaMassima: regola.lunghezzaMassima,
              flagRichiesto: regola.flagRichiesto,
              regola: regola.regola,
              posizione: regola.posizione,
              dataMatch: regola.dataMatch,
            });
          });
          template.composizione = await this.composizioneTemplateRepository.save(composizione);

          return await this.findOneTemplateById(tenant, template.id);
        },
        { connectionName: BOON_DATASOURCE }
      );
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async updateTemplate(tenant: Tenant, user: User, templateId: number, dto: UpdateTemplate) {
    try {
      const now = new Date();
      return await runInTransaction(
        async () => {
          const template = await this.templateClientiRepository.findOne({
            relations: templateOneDefaultRelations,
            where: { id: templateId, idCliente: tenant.cliente.id },
          });
          if (!template) throw new NotFoundException();

          await this.templateValidationService.checkPreValidity(templateId, template.cliente.id, dto);

          if (dto.stato?.id !== undefined && dto.stato.id !== template.idStato) {
            template.stato = await findOneByIdOrFail(this.statiTemplateRepository, 'id', dto.stato.id);
            template.idStato = dto.stato.id;
          }
          if (dto.funzionalita?.id !== undefined && dto.funzionalita.id !== template.idFunzionalita) {
            template.funzionalita = await findOneByIdOrFail(this.funzionalitaRepository, 'id', dto.funzionalita.id);
            template.idFunzionalita = dto.funzionalita.id;
          }
          if (dto.nome !== undefined && dto.nome !== template.nome) {
            template.nome = dto.nome;
          }

          if (dto.composizione !== undefined) {
            const regoleToRemove = differenceWith(template.composizione, dto.composizione, (a, b) =>
              isEqual(omit(a, ['id', 'idTemplate']), b)
            );
            const regoleToAdd = differenceWith(dto.composizione, template.composizione, (a, b) =>
              isEqual(omit(b, ['id', 'idTemplate']), a)
            ).map((regola) => {
              return this.composizioneTemplateRepository.create({
                idTemplate: template.id,
                nomeColonna: regola.nomeColonna,
                tipoDati: regola.tipoDati,
                lunghezzaMassima: regola.lunghezzaMassima,
                flagRichiesto: regola.flagRichiesto,
                regola: regola.regola,
                posizione: regola.posizione,
                dataMatch: regola.dataMatch,
              });
            });

            template.composizione = template.composizione
              .filter((x) => !regoleToRemove.some((y) => x.id === y.id))
              .concat(regoleToAdd);
            await this.composizioneTemplateRepository.remove(regoleToRemove);
            await this.composizioneTemplateRepository.save(template.composizione);
          }

          await this.templateClientiRepository.save(template);

          return await this.findOneTemplateById(tenant, template.id);
        },
        { connectionName: BOON_DATASOURCE }
      );
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
