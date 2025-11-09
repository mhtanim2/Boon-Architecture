import { BOON_DATASOURCE } from '@boon/backend/database';
import { BoonStatiRevisioniEntity } from '@boon/backend/database/entities/boon';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatiRevisioniController } from './stati-revisioni.controller';
import { StatiRevisioniService } from './stati-revisioni.service';

@Module({
  imports: [TypeOrmModule.forFeature([BoonStatiRevisioniEntity], BOON_DATASOURCE)],
  controllers: [StatiRevisioniController],
  providers: [StatiRevisioniService],
})
export class StatiRevisioniModule {}
