import { BOON_DATASOURCE } from '@boon/backend/database';
import { BoonStatiTemplateEntity } from '@boon/backend/database/entities/boon';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatiTemplateController } from './stati-template.controller';
import { StatiTemplateService } from './stati-template.service';

@Module({
  imports: [TypeOrmModule.forFeature([BoonStatiTemplateEntity], BOON_DATASOURCE)],
  controllers: [StatiTemplateController],
  providers: [StatiTemplateService],
})
export class StatiTemplateModule {}
