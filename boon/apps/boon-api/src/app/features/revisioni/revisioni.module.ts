import { BOON_DATASOURCE } from '@boon/backend/database';
import { BoonRevisioniEntity, BoonStatiRevisioniEntity } from '@boon/backend/database/entities/boon';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RevisioniController } from './revisioni.controller';
import { RevisioniService } from './revisioni.service';
import { StatiRevisioniModule } from './stati-revisioni/stati-revisioni.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BoonRevisioniEntity, BoonStatiRevisioniEntity], BOON_DATASOURCE),
    StatiRevisioniModule,
  ],
  controllers: [RevisioniController],
  providers: [RevisioniService],
  exports: [RevisioniService],
})
export class RevisioniModule {}
