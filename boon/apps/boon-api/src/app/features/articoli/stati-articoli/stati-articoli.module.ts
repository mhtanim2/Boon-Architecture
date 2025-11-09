import { BOON_DATASOURCE } from '@boon/backend/database';
import { BoonStatiArticoliEntity } from '@boon/backend/database/entities/boon';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatiArticoliController } from './stati-articoli.controller';
import { StatiArticoliService } from './stati-articoli.service';

@Module({
  imports: [TypeOrmModule.forFeature([BoonStatiArticoliEntity], BOON_DATASOURCE)],
  controllers: [StatiArticoliController],
  providers: [StatiArticoliService],
})
export class StatiArticoliModule {}
