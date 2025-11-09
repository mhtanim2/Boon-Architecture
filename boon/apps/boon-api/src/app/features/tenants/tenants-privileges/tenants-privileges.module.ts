import { BOON_DATASOURCE } from '@boon/backend/database';
import { BoonLivelliPrivilegiEntity, BoonPrivilegiEntity } from '@boon/backend/database/entities/boon';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantsPrivilegesController } from './tenants-privileges.controller';
import { TenantsPrivilegesService } from './tenants-privileges.service';

@Module({
  imports: [TypeOrmModule.forFeature([BoonPrivilegiEntity, BoonLivelliPrivilegiEntity], BOON_DATASOURCE)],
  controllers: [TenantsPrivilegesController],
  providers: [TenantsPrivilegesService],
})
export class TenantsPrivilegesModule {}
