import { BOON_DATASOURCE } from '@boon/backend/database';
import { BoonLivelliPrivilegiEntity } from '@boon/backend/database/entities/boon';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LivelliPrivilegioController } from './livelli-privilegio.controller';
import { LivelliPrivilegioPublicController } from './livelli-privilegio.public.controller';
import { LivelliPrivilegioService } from './livelli-privilegio.service';

@Module({
  imports: [TypeOrmModule.forFeature([BoonLivelliPrivilegiEntity], BOON_DATASOURCE)],
  controllers: [LivelliPrivilegioPublicController, LivelliPrivilegioController],
  providers: [LivelliPrivilegioService],
})
export class LivelliPrivilegioModule {}
