import { BOON_DATASOURCE } from '@boon/backend/database';
import { BoonRuoliEntity } from '@boon/backend/database/entities/boon';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantsRolesController } from './tenants-roles.controller';
import { TenantsRolesService } from './tenants-roles.service';

@Module({
  imports: [TypeOrmModule.forFeature([BoonRuoliEntity], BOON_DATASOURCE)],
  controllers: [TenantsRolesController],
  providers: [TenantsRolesService],
})
export class TenantsRolesModule {}
