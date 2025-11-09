import { User } from '@boon/interfaces/boon-api';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { RequestWithUserTenant } from './request-with-user';

@Injectable()
export class LocalAuthStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  async validate(request: RequestWithUserTenant, username: string, password: string): Promise<User> {
    const account = await this.authService.getAuthenticatedUser(username, password, request.tenant?.cliente?.id);
    return account;
  }
}
