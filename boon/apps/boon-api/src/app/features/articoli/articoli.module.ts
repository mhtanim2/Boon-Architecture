import { BOON_DATASOURCE } from '@boon/backend/database';
import { BoonArticoliEntity, BoonStatiArticoliEntity, BoonTemplateClientiEntity } from '@boon/backend/database/entities/boon';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticoliController } from './articoli.controller';
import { ArticoliService } from './articoli.service';
import { StatiArticoliModule } from './stati-articoli/stati-articoli.module';
import { FileUploadsModule } from '../file-uploads/file-uploads.module';
import { StagioniClientiModule } from '../stagioni-clienti/stagioni-clienti.module';
import { GeneriModule } from '../generi/generi.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BoonArticoliEntity, BoonStatiArticoliEntity, BoonTemplateClientiEntity], BOON_DATASOURCE),
    StatiArticoliModule,
    FileUploadsModule,
    StagioniClientiModule,
    GeneriModule,
  ],
  controllers: [ArticoliController],
  providers: [ArticoliService],
  exports: [ArticoliService],
})
export class ArticoliModule {}
