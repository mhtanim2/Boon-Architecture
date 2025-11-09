import { User } from '@boon/interfaces/boon-api';
import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { isEmpty } from 'lodash';
import { ACCESS_TOKEN_JWT_SERVICE } from '../../modules/jwt-access.module';
import { REFRESH_TOKEN_JWT_SERVICE } from '../../modules/jwt-refresh.module';
import { LocalConfig, localConfig } from '../../modules/local.config';
import { MailerInboxService } from '../mailer/mailer.inbox.service';
import { TokenPayload } from './token-payload.interface';
import { UsersAuthService } from './users/users-auth.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersAuthService: UsersAuthService,
    @Inject(ACCESS_TOKEN_JWT_SERVICE)
    private readonly accessTokenJwtService: JwtService,
    @Inject(REFRESH_TOKEN_JWT_SERVICE)
    private readonly refreshTokenJwtService: JwtService,
    @Inject(localConfig.KEY) private readonly config: LocalConfig,
    private readonly mailerInboxService: MailerInboxService
  ) {}

  public async getAuthenticatedUser(username: string, password: string, clienteId?: number): Promise<User> {
    try {
      const account = await this.usersAuthService.getUserByUsername(username, clienteId);
      if (!account) throw new UnauthorizedException(`Username not found`);
      await this.verifyPassword(password, account.password);
      return account;
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException(`Unknown error`);
    }
  }

  private async verifyPassword(plainTextPassword: string, hashedPassword: string | null) {
    const isPasswordMatching =
      hashedPassword && !isEmpty(hashedPassword) ? await bcrypt.compare(plainTextPassword, hashedPassword) : null;
    if (!isPasswordMatching) {
      throw new UnauthorizedException(`Wrong credentials`);
    }
  }

  public async resetPassword(accountId: number, flagPasswordDaCambiare: boolean, plainTextPassword?: string) {
    await this.usersAuthService.resetPassword(accountId, flagPasswordDaCambiare, plainTextPassword);
  }

  public async verifyEmail(accountId: number) {
    await this.usersAuthService.verifyEmail(accountId, true);
  }

  public async sendRecoveryPasswordMail(
    destination: string,
    url: string,
    verificationCode: string,
    magicLinkTokenExpirationTimeInSeconds: number
  ) {
    const account = await this.usersAuthService.getUserByUsername(destination);
    if (!account) return;

    const mail = {
      baseTemplateName: 'base',
      contentTemplateName: 'self-recovery-password',
      subject: 'Password reset',
      to: [destination],

      context: {
        caption: 'Password reset',
        firstName: account.nome,
        lastName: account.cognome,
        resetUrl: url,
        resetCode: verificationCode,
        expirationInterval: `${magicLinkTokenExpirationTimeInSeconds / 3600} hours`,
      },
    };

    await this.mailerInboxService.addToInbox(mail);
  }

  async sendWelcomeMail(destination: string, url: string, magicLinkTokenExpirationTimeInSeconds: number) {
    const account = await this.usersAuthService.getUserByUsername(destination);
    if (!account) return;

    const mail = {
      baseTemplateName: 'base',
      contentTemplateName: 'user-welcome',
      subject: 'Welcome to Boon!',
      to: [destination],

      context: {
        caption: 'Welcome',
        firstName: account.nome,
        lastName: account.cognome,
        verificationUrl: url,
        expirationInterval: `${magicLinkTokenExpirationTimeInSeconds / 3600} hours`,
      },
    };

    await this.mailerInboxService.addToInbox(mail);
  }

  async sendEmailVerificationMail(destination: string, url: string, magicLinkTokenExpirationTimeInSeconds: number) {
    const account = await this.usersAuthService.getUserByUsername(destination);
    if (!account) return;

    const mail = {
      baseTemplateName: 'base',
      contentTemplateName: 'user-verify-email',
      subject: 'Email verification',
      to: [destination],

      context: {
        caption: 'Email verification',
        firstName: account.nome,
        lastName: account.cognome,
        verificationUrl: url,
        expirationInterval: `${magicLinkTokenExpirationTimeInSeconds / 3600} hours`,
      },
    };

    await this.mailerInboxService.addToInbox(mail);
  }

  public async getCookieWithJwtAccessToken(accountId: number) {
    await this.usersAuthService.setFirstLoginFlag(accountId, false);

    const payload: TokenPayload = { userId: accountId };
    const token = await this.accessTokenJwtService.signAsync(payload);
    const cookie = `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.config.jwtAccessTokenExpirationTimeInSeconds}`;
    return cookie;
  }

  public async getCookieWithJwtRefreshToken(accountId: number) {
    const payload: TokenPayload = { userId: accountId };
    const token = await this.refreshTokenJwtService.signAsync(payload);
    await this.usersAuthService.setCurrentRefreshTokenHash(accountId, token);

    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.config.jwtRefreshTokenExpirationTimeInSeconds}`;
    return { cookie, token };
  }

  public async getCookiesForLogOut(accountId: number) {
    await this.usersAuthService.setCurrentRefreshTokenHash(accountId, null);
    const accessTokenCookie = `Authentication=; HttpOnly; Path=/; Max-Age=0`;
    const refreshTokenCookie = `Refresh=; HttpOnly; Path=/; Max-Age=0`;
    return { accessTokenCookie, refreshTokenCookie };
  }
}
