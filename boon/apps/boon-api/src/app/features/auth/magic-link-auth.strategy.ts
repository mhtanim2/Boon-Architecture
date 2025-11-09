import { DEFAULT_TENANT, User } from '@boon/interfaces/boon-api';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import Strategy from 'passport-magic-login';
import { LocalConfig, localConfig } from '../../modules/local.config';
import { LoginWithMagicLinkQueryDto } from './auth.dto';
import { AuthService } from './auth.service';
import { MagicLinkTokensMemoryStorage } from './magic-link-memory-storage';
import { MagicLinkTokenPayload } from './magic-link-token-payload.interface';
import { UsersAuthService } from './users/users-auth.service';

export class MagicLinkAuthStrategy extends PassportStrategy(Strategy, 'magic-link') {
  private readonly storage: MagicLinkTokensMemoryStorage;

  constructor(
    @Inject(localConfig.KEY) readonly config: LocalConfig,
    private readonly authService: AuthService,
    private readonly userAuthService: UsersAuthService
  ) {
    super({
      secret: config.magicLinkTokenSecret,
      callbackUrl: 'magic-login',
      jwtOptions: {
        expiresIn: `${config.magicLinkTokenExpirationTimeInSeconds}s`,
      },
      sendMagicLink: async (destination: string, href: string, verificationCode: string, req: Request) => {
        let url = `${config.browserUrl}/${DEFAULT_TENANT.slug}/${href}`;
        const query: LoginWithMagicLinkQueryDto = req.query;
        const { action } = query;

        if (action) {
          url += `&action=${action}`;
        }
        // this.storage.set(verificationCode, url);
        switch (action) {
          case 'RESET_PASSWORD':
            this.authService.sendRecoveryPasswordMail(
              destination,
              url,
              verificationCode,
              config.magicLinkTokenExpirationTimeInSeconds
            );
            break;
          case 'WELCOME':
            this.authService.sendWelcomeMail(destination, url, config.magicLinkTokenExpirationTimeInSeconds);
            break;
          case 'VERIFY_EMAIL':
            this.authService.sendEmailVerificationMail(destination, url, config.magicLinkTokenExpirationTimeInSeconds);
            break;
        }
      },
      verify: async (payload: MagicLinkTokenPayload, callback: (err: unknown, ok?: User) => void) => {
        try {
          const res = await this.validate(payload);
          callback(null, res);
        } catch (err) {
          callback(err);
        }
      },
    });
    this.storage = new MagicLinkTokensMemoryStorage();
  }

  async validate(payload: MagicLinkTokenPayload) {
    // const token = await this.storage.get(payload.code);
    // if (!token) throw new UnauthorizedException('Token is invalid or was already used');
    // await this.storage.delete(payload.code);

    const account = await this.userAuthService.getUserByUsername(payload.destination);
    if (!account) throw new UnauthorizedException('Magic Link Guard');
    return account;
  }
}
