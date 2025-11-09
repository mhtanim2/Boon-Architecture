import { Module } from '@nestjs/common';
import { GeneriController } from './generi.controller';
import { GeneriService } from './generi.service';
import { BoonGeneriAliasEntity, BoonGeneriEntity } from '@boon/backend/database/entities/boon';
import { BOON_DATASOURCE } from '@boon/backend/database';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([BoonGeneriEntity, BoonGeneriAliasEntity], BOON_DATASOURCE)],
  controllers: [GeneriController],
  providers: [GeneriService],
  exports: [GeneriService]
})
export class GeneriModule {}
