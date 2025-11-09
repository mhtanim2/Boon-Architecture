import { BOON_DATASOURCE } from '@boon/backend/database';
import { BoonFunzionalitaClientiEntity } from '@boon/backend/database/entities/boon';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantsFeaturesController } from './tenants-features.controller';
import { TenantsFeaturesService } from './tenants-features.service';

@Module({
  imports: [TypeOrmModule.forFeature([BoonFunzionalitaClientiEntity], BOON_DATASOURCE)],
  controllers: [TenantsFeaturesController],
  providers: [TenantsFeaturesService],
})
export class TenantsFeaturesModule {}
