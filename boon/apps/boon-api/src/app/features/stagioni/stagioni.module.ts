import { Module } from '@nestjs/common';
import { StagioniController } from './stagioni.controller';
import { StagioniService } from './stagioni.service';
import { BoonStagioniEntity } from '@boon/backend/database/entities/boon';
import { BOON_DATASOURCE } from '@boon/backend/database';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([BoonStagioniEntity], BOON_DATASOURCE)],
  controllers: [StagioniController],
  providers: [StagioniService],
})
export class StagioniModule {}
