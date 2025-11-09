import { BOON_DATASOURCE } from '@boon/backend/database';
import {
  BoonClientiEntity,
  BoonComposizioneTemplateEntity,
  BoonFunzionalitaClientiEntity,
  BoonFunzionalitaEntity,
  BoonStatiTemplateEntity,
  BoonTemplateClientiEntity,
} from '@boon/backend/database/entities/boon';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatiTemplateModule } from './stati-template/stati-template.module';
import { TemplateController } from './template.controller';
import { TemplateService } from './template.service';
import { TemplateValidationService } from './template.validation';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        BoonTemplateClientiEntity,
        BoonComposizioneTemplateEntity,
        BoonStatiTemplateEntity,
        BoonClientiEntity,
        BoonTemplateClientiEntity,
        BoonFunzionalitaClientiEntity,
        BoonFunzionalitaEntity,
      ],
      BOON_DATASOURCE
    ),
    StatiTemplateModule,
  ],
  controllers: [TemplateController],
  providers: [TemplateService, TemplateValidationService],
  exports: [TemplateService],
})
export class TemplateModule {}
