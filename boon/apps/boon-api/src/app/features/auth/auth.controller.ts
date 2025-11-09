import { Controller, Get, HttpCode, HttpStatus, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiCookieAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { UseZodGuard } from '../../../zod/guard';
import {
  LoginWithCredentialsBodyDto,
  LoginWithMagicLinkBodyDto,
  LoginWithMagicLinkCallbackQueryDto,
  LoginWithMagicLinkQueryDto,
  LoginWithMagicLinkResBodyDto,
} from './auth.dto';
import { AuthService } from './auth.service';
import { JwtAccessTokenAuthGuard } from './jwt-access-token-auth.guard';
import { JwtRefreshTokenAuthGuard } from './jwt-refresh-token-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { MagicLinkAuthGuard } from './magic-link-auth.guard';
import { MagicLinkAuthStrategy } from './magic-link-auth.strategy';
import { RequestWithUserTenant } from './request-with-user';
import { TenantMustBeSpecified, TenantMustBeSpecifiedGuard } from './tenant-must-be-specified.guard';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly magicLinkAuthStrategy: MagicLinkAuthStrategy
  ) {}

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, description: 'Successful response' })
  @UseGuards(LocalAuthGuard)
  @UseZodGuard('body', LoginWithCredentialsBodyDto)
  @ApiBody({ type: LoginWithCredentialsBodyDto })
  @Post('login')
  async logIn(@Req() request: RequestWithUserTenant, @Res() response: Response) {
    const { user } = request;

    await this.setLoginCookiesInResponse(user, response);
    return response.send();
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, description: 'Successful response' })
  @UseGuards(LocalAuthGuard)
  @UseGuards(TenantMustBeSpecifiedGuard)
  @UseZodGuard('body', LoginWithCredentialsBodyDto)
  @ApiBody({ type: LoginWithCredentialsBodyDto })
  @TenantMustBeSpecified()
  @Post('/login/:tenant')
  async logInOnTenant(@Req() request: RequestWithUserTenant, @Res() response: Response) {
    const { user } = request;

    await this.setLoginCookiesInResponse(user, response);
    return response.send();
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, description: 'Successful response' })
  @UseGuards(JwtRefreshTokenAuthGuard)
  @Post('refresh')
  async refresh(@Req() request: RequestWithUserTenant, @Res() response: Response) {
    const { user } = request;

    await this.setLoginCookiesInResponse(user, response);
    return response.send();
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, description: 'Successful response' })
  @UseGuards(JwtAccessTokenAuthGuard)
  @ApiCookieAuth()
  @Post('logout')
  async logOut(@Req() request: RequestWithUserTenant, @Res() response: Response) {
    const { user } = request;

    await this.setLogoutCookiesInResponse(user, response);
    return response.send();
  }

  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: LoginWithMagicLinkBodyDto })
  @ApiQuery({ type: LoginWithMagicLinkQueryDto })
  @ApiResponse({ status: HttpStatus.OK, type: LoginWithMagicLinkResBodyDto, description: 'Successful response' })
  @Post('magic-login')
  async magicLogIn(@Req() request: Request, @Res() response: Response) {
    return this.magicLinkAuthStrategy.send(request, response);
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, description: 'Successful response' })
  @UseGuards(MagicLinkAuthGuard)
  @Get('magic-login/callback')
  async magicLogInCallback(
    @Req() request: RequestWithUserTenant,
    @Res() response: Response,
    @Query() query: LoginWithMagicLinkCallbackQueryDto
  ) {
    const { user } = request;
    const { action } = query;

    switch (action) {
      case 'RESET_PASSWORD':
        await this.authService.resetPassword(user.id, true);
        break;
      case 'WELCOME':
        await this.authService.verifyEmail(user.id);
        break;
      case 'VERIFY_EMAIL':
        await this.authService.verifyEmail(user.id);
        break;
    }

    await this.setLoginCookiesInResponse(user, response);
    return response.send();
  }

  private async setLoginCookiesInResponse(user: RequestWithUserTenant['user'], response: Response) {
    const accessTokenCookie = await this.authService.getCookieWithJwtAccessToken(user.id);
    const { cookie: refreshTokenCookie } = await this.authService.getCookieWithJwtRefreshToken(user.id);

    response.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
  }

  private async setLogoutCookiesInResponse(user: RequestWithUserTenant['user'], response: Response) {
    const { accessTokenCookie, refreshTokenCookie } = await this.authService.getCookiesForLogOut(user.id);

    response.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
  }
}
