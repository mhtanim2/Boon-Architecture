import { BOON_DATASOURCE } from '@boon/backend/database';
import { BoonAccountsEntity } from '@boon/backend/database/entities/boon';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersAuthService } from './users-auth.service';
import { UsersMeController } from './users-me.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BoonAccountsEntity], BOON_DATASOURCE)],
  controllers: [UsersMeController],
  providers: [UsersAuthService],
  exports: [UsersAuthService],
})
export class UsersAuthModule {}
