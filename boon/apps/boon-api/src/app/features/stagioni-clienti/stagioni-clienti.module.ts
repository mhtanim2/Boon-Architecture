import { BOON_DATASOURCE } from '@boon/backend/database';
import { BoonStagioniClientiEntity, BoonStagioniEntity } from '@boon/backend/database/entities/boon';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StagioniClientiController } from './stagioni-clienti.controller';
import { StagioniClientiService } from './stagioni-clienti.service';

@Module({
  imports: [TypeOrmModule.forFeature([BoonStagioniClientiEntity, BoonStagioniEntity], BOON_DATASOURCE)],
  controllers: [StagioniClientiController],
  providers: [StagioniClientiService],
  exports: [StagioniClientiService]
})
export class StagioniClientiModule {}
