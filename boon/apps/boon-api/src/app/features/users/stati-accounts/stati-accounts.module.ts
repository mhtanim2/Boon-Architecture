import { BOON_DATASOURCE } from '@boon/backend/database';
import { BoonStatiAccountsEntity } from '@boon/backend/database/entities/boon';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatiAccountsController } from './stati-accounts.controller';
import { StatiAccountsService } from './stati-accounts.service';

@Module({
  imports: [TypeOrmModule.forFeature([BoonStatiAccountsEntity], BOON_DATASOURCE)],
  controllers: [StatiAccountsController],
  providers: [StatiAccountsService],
})
export class StatiAccountsModule {}
