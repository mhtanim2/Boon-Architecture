import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { LocalConfig, localConfig } from '../../modules/local.config';
import { RequestWithUserTenant } from './request-with-user';
import { TokenPayload } from './token-payload.interface';
import { UsersAuthService } from './users/users-auth.service';

@Injectable()
export class JwtRefreshTokenAuthStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
  constructor(
    @Inject(localConfig.KEY) readonly config: LocalConfig,
    private readonly usersAuthService: UsersAuthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Refresh;
        },
      ]),
      secretOrKey: config.jwtRefreshTokenSecret,
      passReqToCallback: true,
    });
  }

  async validate(request: RequestWithUserTenant, payload: TokenPayload) {
    const refreshToken = request.cookies?.Refresh;
    const account = this.usersAuthService.getUserByIdAndRefreshTokenPair(
      payload.userId,
      refreshToken,
      request.tenant?.cliente?.id
    );
    if (!account) throw new UnauthorizedException('Refresh Token Guard');
    return account;
  }
}
