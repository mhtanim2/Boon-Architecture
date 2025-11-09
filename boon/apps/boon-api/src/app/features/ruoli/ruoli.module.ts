import { BOON_DATASOURCE } from '@boon/backend/database';
import { BoonRuoliEntity } from '@boon/backend/database/entities/boon';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RuoliController } from './ruoli.controller';
import { RuoliService } from './ruoli.service';

@Module({
  imports: [TypeOrmModule.forFeature([BoonRuoliEntity], BOON_DATASOURCE)],
  controllers: [RuoliController],
  providers: [RuoliService],
})
export class RuoliModule {}
