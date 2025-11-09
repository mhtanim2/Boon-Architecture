import { BOON_DATASOURCE } from '@boon/backend/database';
import {
  BoonAccountsClientiEntity,
  BoonAccountsEntity,
  BoonAccountsFunzionalitaEntity,
  BoonClientiEntity,
  BoonFunzionalitaEntity,
  BoonPrivilegiEntity,
  BoonProfiliEntity,
  BoonRuoliEntity,
  BoonStatiAccountsEntity,
} from '@boon/backend/database/entities/boon';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatiAccountsModule } from './stati-accounts/stati-accounts.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersValidationService } from './users.validation';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        BoonAccountsEntity,
        BoonAccountsClientiEntity,
        BoonProfiliEntity,
        BoonStatiAccountsEntity,
        BoonAccountsFunzionalitaEntity,
        BoonRuoliEntity,
        BoonClientiEntity,
        BoonFunzionalitaEntity,
        BoonPrivilegiEntity,
      ],
      BOON_DATASOURCE
    ),
    StatiAccountsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersValidationService],
  exports: [UsersService, UsersValidationService],
})
export class UsersModule {}
