import { BOON_DATASOURCE } from '@boon/backend/database';
import { BoonClientiEntity, BoonTenantsEntity } from '@boon/backend/database/entities/boon';
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantsFeaturesModule } from './tenants-features/tenants-features.module';
import { TenantsPrivilegesModule } from './tenants-privileges/tenants-privileges.module';
import { TenantsRolesModule } from './tenants-roles/tenants-roles.module';
import { TenantsController } from './tenants.controller';
import { TenantsService } from './tenants.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([BoonTenantsEntity, BoonClientiEntity], BOON_DATASOURCE),
    TenantsFeaturesModule,
    TenantsPrivilegesModule,
    TenantsRolesModule,
  ],
  controllers: [TenantsController],
  providers: [TenantsService],
  exports: [TenantsService],
})
export class TenantsModule {}
