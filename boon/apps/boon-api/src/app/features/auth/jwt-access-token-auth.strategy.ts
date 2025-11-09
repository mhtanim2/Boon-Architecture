import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { LocalConfig, localConfig } from '../../modules/local.config';
import { RequestWithUserTenant } from './request-with-user';
import { TokenPayload } from './token-payload.interface';
import { UsersAuthService } from './users/users-auth.service';

@Injectable()
export class JwtAccessTokenAuthStrategy extends PassportStrategy(Strategy, 'jwt-access-token') {
  constructor(
    @Inject(localConfig.KEY) readonly config: LocalConfig,
    private readonly userAuthService: UsersAuthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication;
        },
      ]),
      secretOrKey: config.jwtAccessTokenSecret,
      passReqToCallback: true,
    });
  }

  async validate(request: RequestWithUserTenant, payload: TokenPayload) {
    const account = await this.userAuthService.getUserById(payload.userId, request.tenant?.cliente?.id);
    if (!account) throw new UnauthorizedException('Access Token Guard');
    return account;
  }
}
