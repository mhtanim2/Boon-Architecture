import { BOON_DATASOURCE } from '@boon/backend/database';
import {
  BoonAccountsEntity,
  BoonFileUploadEntity,
  BoonTemplateClientiEntity,
} from '@boon/backend/database/entities/boon';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileUploadsController } from './file-uploads.controller';
import { FileUploadsService } from './file-uploads.service';
import { FileUploadsValidationService } from './file-uploads.validation';

@Module({
  imports: [
    TypeOrmModule.forFeature([BoonFileUploadEntity, BoonAccountsEntity, BoonTemplateClientiEntity], BOON_DATASOURCE),
  ],
  controllers: [FileUploadsController],
  providers: [FileUploadsService, FileUploadsValidationService],
  exports: [FileUploadsService]
})
export class FileUploadsModule {}
