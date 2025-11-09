import { BOON_DATASOURCE } from '@boon/backend/database';
import { BoonAccountsEntity } from '@boon/backend/database/entities/boon';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAccessTokenModule } from '../../modules/jwt-access.module';
import { JwtRefreshTokenModule } from '../../modules/jwt-refresh.module';
import { MailerModule } from '../mailer/mailer.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAccessTokenAuthStrategy } from './jwt-access-token-auth.strategy';
import { JwtRefreshTokenAuthStrategy } from './jwt-refresh-token-auth.strategy';
import { LocalAuthStrategy } from './local-auth.strategy';
import { MagicLinkAuthStrategy } from './magic-link-auth.strategy';
import { UsersAuthModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BoonAccountsEntity], BOON_DATASOURCE),
    PassportModule,
    JwtAccessTokenModule,
    JwtRefreshTokenModule,
    MailerModule,
    UsersModule,
    UsersAuthModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalAuthStrategy,
    JwtAccessTokenAuthStrategy,
    JwtRefreshTokenAuthStrategy,
    MagicLinkAuthStrategy,
  ],
})
export class AuthModule {}
