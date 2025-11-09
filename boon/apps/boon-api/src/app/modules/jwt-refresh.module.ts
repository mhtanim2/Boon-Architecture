import { Module } from '@nestjs/common';
import { JwtService, JwtModule as NestJwtModule } from '@nestjs/jwt';
import { LocalConfig, localConfig } from './local.config';

export const REFRESH_TOKEN_JWT_SERVICE = Symbol('REFRESH_TOKEN_JWT_SERVICE');
const refreshTokenJwtProvider = {
  provide: REFRESH_TOKEN_JWT_SERVICE,
  useFactory: (jwtService: JwtService) => jwtService,
  inject: [JwtService],
};

@Module({
  imports: [
    NestJwtModule.registerAsync({
      useFactory: async (localConfig: LocalConfig) => ({
        secret: localConfig.jwtRefreshTokenSecret,
        signOptions: {
          expiresIn: `${localConfig.jwtRefreshTokenExpirationTimeInSeconds}s`,
        },
      }),
      inject: [localConfig.KEY],
    }),
  ],
  providers: [refreshTokenJwtProvider],
  exports: [refreshTokenJwtProvider],
})
export class JwtRefreshTokenModule {}
