import { BOON_DATASOURCE } from '@boon/backend/database';
import { BoonParametriEntity } from '@boon/backend/database/entities/boon';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParametersService } from './parameters.service';

@Module({
  imports: [TypeOrmModule.forFeature([BoonParametriEntity], BOON_DATASOURCE)],
  providers: [ParametersService],
  exports: [ParametersService],
})
export class ParametersModule {}
