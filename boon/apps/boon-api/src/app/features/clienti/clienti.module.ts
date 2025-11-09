import { BOON_DATASOURCE } from '@boon/backend/database';
import { BoonClientiEntity, BoonLuoghiEntity, BoonTenantsEntity } from '@boon/backend/database/entities/boon';
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientiController } from './clienti.controller';
import { ClientiService } from './clienti.service';
import { ClientiValidationService } from './clienti.validation';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([BoonClientiEntity, BoonTenantsEntity, BoonLuoghiEntity], BOON_DATASOURCE)],
  controllers: [ClientiController],
  providers: [ClientiService, ClientiValidationService],
  exports: [ClientiService, ClientiValidationService],
})
export class ClientiModule {}
