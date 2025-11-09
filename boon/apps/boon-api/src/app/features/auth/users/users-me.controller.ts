import { Tenant, User } from '@boon/interfaces/boon-api';

import { Body, Controller, HttpCode, HttpStatus, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ZodSerializerDto } from '../../../../zod/serializer';
import { JwtAccessTokenAuthGuard } from '../jwt-access-token-auth.guard';
import { PasswordMustNotBeReset, PasswordMustNotBeResetGuard } from '../password-must-not-be-reset.guard';
import { RequestWithUserTenant } from '../request-with-user';
import { AuthenticatedUser, ReqTenant } from '../user-tenant.decorator';
import { UsersAuthService } from './users-auth.service';
import { SetMyPasswordDto, UserMeResDto } from './users-me.dto';

@UseGuards(PasswordMustNotBeResetGuard)
@UseGuards(JwtAccessTokenAuthGuard)
@ApiCookieAuth()
@ApiTags('auth')
@Controller('me')
export class UsersMeController {
  constructor(private readonly usersAuthService: UsersAuthService) {}

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, description: 'Successful response', type: UserMeResDto })
  @ZodSerializerDto(UserMeResDto)
  @PasswordMustNotBeReset(false)
  @Post()
  async getMe(@AuthenticatedUser() user: User, @ReqTenant() tenant: Tenant | null) {
    return this.usersAuthService.getUserById(user.id, tenant?.cliente?.id);
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, description: 'Successful response' })
  @PasswordMustNotBeReset(false)
  @Put('password')
  async setMyPassword(@Req() request: RequestWithUserTenant, @Body() dto: SetMyPasswordDto) {
    const { user } = request;
    const { password } = dto;

    await this.usersAuthService.resetPassword(user.id, false, password);
  }
}
