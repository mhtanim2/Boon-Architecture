import { BOON_DATASOURCE } from '@boon/backend/database';
import { BoonArticoliEntity } from '@boon/backend/database/entities/boon.articoli.entity';
import { BoonFileUploadEntity } from '@boon/backend/database/entities/boon.file_upload.entity';
import { BoonTemplateClientiEntity } from '@boon/backend/database/entities/boon.template_clienti.entity';
import { Tenant, User } from '@boon/interfaces/boon-api';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { keyBy } from 'lodash';
import { PaginateQuery } from 'nestjs-paginate';
import { Repository } from 'typeorm';
import { runInTransaction } from 'typeorm-transactional';
import { DeepPartial } from 'utility-types';
import { GeneriService } from '../generi/generi.service';
import { StagioniClientiService } from '../stagioni-clienti/stagioni-clienti.service';
import { templateOneDefaultRelations } from '../template/template.orm';
import { ArticoliBulkImport } from './articoli.dto';
import dayjs = require('dayjs');
import { BoonStatiArticoliEntity } from '@boon/backend/database/entities/boon.stati_articoli.entity';

@Injectable()
export class ArticoliService {
  private readonly logger = new Logger(ArticoliService.name);

  constructor(
    private readonly stagioniClientiService: StagioniClientiService,
    private readonly generiService: GeneriService,
    @InjectRepository(BoonArticoliEntity, BOON_DATASOURCE)
    private readonly articoliRepository: Repository<BoonArticoliEntity>,
    @InjectRepository(BoonTemplateClientiEntity, BOON_DATASOURCE)
    private readonly templateClientiRepository: Repository<BoonTemplateClientiEntity>,
    @InjectRepository(BoonStatiArticoliEntity, BOON_DATASOURCE)
    private readonly statiArticoliRepository: Repository<BoonStatiArticoliEntity>
  ) {}

  private async findOneTemplateById(templateId: number) {
    const entity = await this.templateClientiRepository.findOne({
      relations: templateOneDefaultRelations,
      where: { id: templateId },
    });
    if (!entity) throw new NotFoundException();
    return entity;
  }

  async bulkImportArticoli(user: User, tenant: Tenant, dto: ArticoliBulkImport, fileUpload: BoonFileUploadEntity) {
    const template = await this.findOneTemplateById(dto.template.id);

    const statiArticoli = await this.statiArticoliRepository.find();

    const stagioniClienti = (await this.stagioniClientiService.findStagioniClienti(tenant, {} as PaginateQuery)).data;
    const stagioniClientiMap = keyBy(stagioniClienti, (x) => x.codice);

    const generi = (await this.generiService.findGeneri({} as PaginateQuery)).data.flatMap((genere) =>
      genere.alias.flatMap((alias) => ({ ...genere, alias: alias.alias }))
    );
    const generiMap = keyBy(generi, (x) => x.alias);

    try {
      const now = new Date();

      const remappedRows = dto.data.map((row) => {
        const remappedRow = template.composizione.reduce((accumulator, rule) => {
          if (!rule.dataMatch) return accumulator; // TODO ???
          const [tableDataMatch, colDataMatch] = rule.dataMatch.split('.');

          let val = row[rule.nomeColonna];

          if (val) {
            switch (true) {
              case rule.tipoDati === 'date': {
                val = dayjs(val).isValid() ? dayjs(val).utc().toDate() : dayjs(val, 'DD/MM/YYYY').toDate();
                break;
              }
            }
          }
          if (val) {
            switch (true) {
              case rule.dataMatch === 'articoli.idStagioneCliente': {
                val = stagioniClientiMap[val];
                break;
              }
              case rule.dataMatch === 'articoli.idGenere': {
                val = generiMap[val];
                break;
              }
            }
          }

          accumulator[colDataMatch] = val;
          return accumulator;
        }, {} as any);

        remappedRow.idCliente = tenant.cliente.id;
        remappedRow.idStato = statiArticoli[0].id;
        return remappedRow;
      });

      return await runInTransaction(
        async () => {
          const entities: BoonArticoliEntity[] = [];
          for (const row of remappedRows) {
            const entity = this.articoliRepository.create(row as DeepPartial<BoonArticoliEntity>);
            console.log(entity);
            await this.articoliRepository.save(entity);
            entities.push(entity);
          }

          return entities;
        },
        { connectionName: BOON_DATASOURCE }
      );
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
