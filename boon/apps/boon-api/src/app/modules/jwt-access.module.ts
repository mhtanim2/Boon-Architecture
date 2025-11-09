import { Module } from '@nestjs/common';
import { JwtService, JwtModule as NestJwtModule } from '@nestjs/jwt';
import { LocalConfig, localConfig } from './local.config';

export const ACCESS_TOKEN_JWT_SERVICE = Symbol('ACCESS_TOKEN_JWT_SERVICE');
const accessTokenJwtProvider = {
  provide: ACCESS_TOKEN_JWT_SERVICE,
  useFactory: (jwtService: JwtService) => jwtService,
  inject: [JwtService],
};

@Module({
  imports: [
    NestJwtModule.registerAsync({
      useFactory: async (localConfig: LocalConfig) => ({
        secret: localConfig.jwtAccessTokenSecret,
        signOptions: {
          expiresIn: `${localConfig.jwtAccessTokenExpirationTimeInSeconds}s`,
        },
      }),
      inject: [localConfig.KEY],
    }),
  ],
  providers: [accessTokenJwtProvider],
  exports: [accessTokenJwtProvider],
})
export class JwtAccessTokenModule {}
