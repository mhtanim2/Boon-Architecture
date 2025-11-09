import { BOON_DATASOURCE } from '@boon/backend/database';
import {
  BoonAccountsEntity,
  BoonFileUploadEntity,
  BoonTemplateClientiEntity,
} from '@boon/backend/database/entities/boon';
import { CreateFileUpload, Tenant, UpdateFileUpload, User } from '@boon/interfaces/boon-api';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, PaginateConfig, PaginateQuery, paginate } from 'nestjs-paginate';
import * as path from 'path';
import { Repository } from 'typeorm';
import { runInTransaction } from 'typeorm-transactional';
import { FileTransaction } from '../../../files/file-transaction';
import { findOneByIdOrFail } from '../../../typeorm/find-by-or-fail';
import { LocalConfig, localConfig } from '../../modules/local.config';
import {
  fileUploadDefaultQbWhere,
  fileUploadDefaultWhere,
  fileUploadManyDefaultRelations,
  fileUploadOneDefaultRelations,
} from './file-uploads.orm';
import { FileUploadsValidationService } from './file-uploads.validation';
import { dayjs } from '@boon/common/dayjs';

@Injectable()
export class FileUploadsService {
  private readonly logger = new Logger(FileUploadsService.name);

  private readonly fileUploadDestDirectory: string;
  private readonly fileUploadFolderPath: string;

  constructor(
    @Inject(localConfig.KEY) localConfig: LocalConfig,
    private readonly fileUploadValidationService: FileUploadsValidationService,
    @InjectRepository(BoonFileUploadEntity, BOON_DATASOURCE)
    private readonly fileUploadRepository: Repository<BoonFileUploadEntity>,
    @InjectRepository(BoonAccountsEntity, BOON_DATASOURCE)
    private readonly accountsRepository: Repository<BoonAccountsEntity>,
    @InjectRepository(BoonTemplateClientiEntity, BOON_DATASOURCE)
    private readonly templatesRepository: Repository<BoonTemplateClientiEntity>
  ) {
    this.fileUploadDestDirectory = localConfig.fileUploadDestDirectory;
    this.fileUploadFolderPath = path.join(localConfig.fileUploadDestDirectory, 'file-uploads');
  }

  async findFileUpload(tenant: Tenant, query: PaginateQuery) {
    const findPaginateConfig: PaginateConfig<BoonFileUploadEntity> = {
      relations: fileUploadManyDefaultRelations,
      sortableColumns: [
        'id',
        'template.nome',
        'uploader.username',
        'dataOra',
        'ultimaModifica',
        'nomeFile',
        'dimensione',
      ],
      searchableColumns: ['template.nome', 'uploader.username', 'nomeFile'],
      defaultSortBy: [
        ['template.nome', 'ASC'],
        ['ultimaModifica', 'ASC'],
      ],
      defaultLimit: 0,
      maxLimit: 0,
      filterableColumns: {
        id: [FilterOperator.EQ, FilterOperator.IN],
        'cliente.id': [FilterOperator.EQ, FilterOperator.IN],
        'stato.id': [FilterOperator.EQ, FilterOperator.IN],
        'template.funzionalita.id': [FilterOperator.EQ, FilterOperator.IN],
        nomeFile: Object.values(FilterOperator),
        url: Object.values(FilterOperator),
        dataOra: [FilterOperator.EQ, FilterOperator.GTE, FilterOperator.LTE],
        ultimaModifica: [FilterOperator.EQ, FilterOperator.GTE, FilterOperator.LTE],
      },
      relativePath: true,
    };
    query.limit ??= 0;

    // TODO: Hack for nestjs-paginate bug with nested wheres
    const qb = this.fileUploadRepository
      .createQueryBuilder('fileUpload')
      .leftJoin('fileUpload.template', 'fileUpload_template')
      .andWhere(...fileUploadDefaultQbWhere('fileUpload_template', tenant));

    return await paginate(query, qb, { ...findPaginateConfig });
  }

  async findOneFileUploadById(tenant: Tenant, fileUploadId: number) {
    const entity = await this.fileUploadRepository.findOne({
      relations: fileUploadOneDefaultRelations,
      where: { ...fileUploadDefaultWhere(tenant), id: fileUploadId },
    });
    if (!entity) throw new NotFoundException();
    return entity;
  }

  async downloadOneFileUploadById(tenant: Tenant, fileUploadId: number) {
    const fileUpload = await this.findOneFileUploadById(tenant, fileUploadId);
    const filepath = path.join(this.fileUploadDestDirectory, fileUpload.url);

    return { filepath, fileUpload };
  }

  async createFileUpload(user: User, tenant: Tenant, dto: CreateFileUpload, file: Express.Multer.File) {
    const fileTransactions: FileTransaction[] = [];
    try {
      const now = new Date();
      const fileUpload = await runInTransaction(
        async () => {
          const { name, ext } = path.parse(file.originalname);
          const filename = `${name}_${dayjs().format('YYYYMMDD_hhmmss')}${ext}`;

          const destUri = path.join(this.fileUploadFolderPath, filename);
          dto.file = path.relative(this.fileUploadDestDirectory, destUri);

          const fileTransaction = new FileTransaction(this.logger);
          fileTransactions.push(fileTransaction);

          await fileTransaction.addFile(file.path, destUri);

          await this.fileUploadValidationService.checkPreValidity(undefined, dto);

          const fileUpload = this.fileUploadRepository.create({
            template: await findOneByIdOrFail(this.templatesRepository, 'id', dto.template.id, {
              idCliente: tenant.cliente.id,
            }),
            uploader: await findOneByIdOrFail(this.accountsRepository, 'id', user.id),
            url: dto.file,
            nomeFile: file.originalname,
            dimensione: file.size,
          });
          await this.fileUploadRepository.save(fileUpload);

          return await this.findOneFileUploadById(tenant, fileUpload.id);
        },
        { connectionName: BOON_DATASOURCE }
      );

      for (const fileTransaction of fileTransactions) {
        await fileTransaction.commitTransaction();
      }

      return fileUpload;
    } catch (err) {
      for (const fileTransaction of fileTransactions) {
        await fileTransaction.rollbackTransaction();
      }

      this.logger.error(err);
      throw err;
    }
  }

  async updateFileUpload(
    user: User,
    tenant: Tenant,
    fileUploadId: number,
    dto: UpdateFileUpload,
    file: Express.Multer.File | undefined
  ) {
    const fileTransactions: FileTransaction[] = [];
    try {
      const now = new Date();
      const fileUpload = await runInTransaction(
        async () => {
          const fileUpload = await this.fileUploadRepository.findOne({
            relations: fileUploadOneDefaultRelations,
            where: { ...fileUploadDefaultWhere(tenant), id: fileUploadId },
          });
          if (!fileUpload) throw new NotFoundException();

          if (file !== undefined) {
            const { name, ext } = path.parse(file.originalname);
            const filename = `${name}_${dayjs().format('YYYYMMDD_hhmmss')}${ext}`;

            const destUri = path.join(this.fileUploadFolderPath, filename);
            console.log('destUri', destUri)

            dto.file = path.relative(this.fileUploadDestDirectory, destUri);

            const fileTransaction = new FileTransaction(this.logger);
            fileTransactions.push(fileTransaction);

            if (dto.file !== fileUpload.url) {
              await fileTransaction.deleteFile(path.join(this.fileUploadDestDirectory, fileUpload.url));
            }
            await fileTransaction.addFile(file.path, destUri);
          }

          await this.fileUploadValidationService.checkPreValidity(fileUploadId, dto);

          if (user.id !== fileUpload.idUploader) {
            fileUpload.uploader = await findOneByIdOrFail(this.accountsRepository, 'id', user.id);
            fileUpload.idUploader = user.id;
          }
          if (file) {
            fileUpload.url = dto.file;
            fileUpload.nomeFile = file.originalname;
            fileUpload.dimensione = file.size;
            fileUpload.ultimaModifica = now;
          }

          await this.fileUploadRepository.save(fileUpload);

          return await this.findOneFileUploadById(tenant, fileUpload.id);
        },
        { connectionName: BOON_DATASOURCE }
      );

      for (const fileTransaction of fileTransactions) {
        await fileTransaction.commitTransaction();
      }

      return fileUpload;
    } catch (err) {
      for (const fileTransaction of fileTransactions) {
        await fileTransaction.rollbackTransaction();
      }

      this.logger.error(err);
      throw err;
    }
  }

  async deleteFileUpload(user: User, tenant: Tenant, fileUploadId: number) {
    const fileTransactions: FileTransaction[] = [];
    try {
      const now = new Date();
      const fileUpload = await runInTransaction(
        async () => {
          const fileUpload = await this.findOneFileUploadById(tenant, fileUploadId);
          if (!fileUpload) throw new NotFoundException();

          const fileTransaction = new FileTransaction(this.logger);
          fileTransactions.push(fileTransaction);

          await fileTransaction.deleteFile(path.join(this.fileUploadDestDirectory, fileUpload.url));

          await this.fileUploadRepository.softDelete({ id: fileUpload.id });

          return fileUpload;
        },
        { connectionName: BOON_DATASOURCE }
      );

      for (const fileTransaction of fileTransactions) {
        await fileTransaction.commitTransaction();
      }

      return fileUpload;
    } catch (err) {
      for (const fileTransaction of fileTransactions) {
        await fileTransaction.rollbackTransaction();
      }

      this.logger.error(err);
      throw err;
    }
  }
}
