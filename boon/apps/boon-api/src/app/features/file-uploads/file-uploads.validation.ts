import { BOON_DATASOURCE } from '@boon/backend/database';
import { BoonFileUploadEntity } from '@boon/backend/database/entities/boon';
import { NamedSingleErrorWithCtx } from '@boon/common/core';
import { CreateFileUpload, UpdateFileUpload } from '@boon/interfaces/boon-api';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { z } from 'zod';

@Injectable()
export class FileUploadsValidationService {
  constructor(
    @InjectRepository(BoonFileUploadEntity, BOON_DATASOURCE)
    private readonly fileUploadsRepository: Repository<BoonFileUploadEntity>
  ) {}

  async checkPreValidity(idFileUpload: number | undefined, dto: CreateFileUpload | UpdateFileUpload) {
    const errors = [];

    if (dto.file !== undefined) {
      const isUrlAvailable = await this.isUrlAvailable(idFileUpload, dto);
      if (!isUrlAvailable) {
        const ctx = { url: dto.file };
        errors.push(new UrlNotAvailableError({ ctx }));
      }
    }

    switch (true) {
      case errors.length > 1:
        throw new AggregateError(errors);
      case errors.length === 1:
        throw errors[0];
    }
  }

  async isUrlAvailable(
    idFileUpload: number | undefined,
    fileUpload: Pick<CreateFileUpload | UpdateFileUpload, 'file'>
  ) {
    return (
      (await this.fileUploadsRepository.countBy({
        id: idFileUpload ? Not(idFileUpload) : undefined,
        url: fileUpload.file,
      })) === 0
    );
  }
}

export const UrlNotAvailableErrorDef = {
  statusCode: 400,
  code: `URL_NOT_AVAILABLE`,
  message: `Url '{url}' is not available.`,
  ctx: z.object({
    url: z.string(),
  }),
};
export class UrlNotAvailableError extends NamedSingleErrorWithCtx(UrlNotAvailableErrorDef) {}
