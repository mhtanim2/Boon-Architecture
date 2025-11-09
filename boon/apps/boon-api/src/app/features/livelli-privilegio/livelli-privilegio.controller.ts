import { Tenant, User } from '@boon/interfaces/boon-api';

import { Body, Controller, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PrivilegesGuard } from '../../../guards/privileges.guard';
import { Roles, RolesGuard } from '../../../guards/roles.guard';
import { ZodSerializerDto } from '../../../zod/serializer';
import { JwtAccessTokenAuthGuard } from '../auth/jwt-access-token-auth.guard';
import { PasswordMustNotBeResetGuard } from '../auth/password-must-not-be-reset.guard';
import { AuthenticatedUser, ReqTenant } from '../auth/user-tenant.decorator';
import { LivelloPrivilegioResDto, UpdateLivelloPrivilegioDto } from './livelli-privilegio.dto';
import { LivelliPrivilegioService } from './livelli-privilegio.service';

@UseGuards(PrivilegesGuard)
@UseGuards(RolesGuard)
@UseGuards(PasswordMustNotBeResetGuard)
@UseGuards(JwtAccessTokenAuthGuard)
@ApiCookieAuth()
@ApiTags('privilegi')
@Controller()
export class LivelliPrivilegioController {
  constructor(private readonly livelliPrivilegioService: LivelliPrivilegioService) {}

  @ApiResponse({ description: 'Successful response', type: LivelloPrivilegioResDto })
  @ZodSerializerDto(LivelloPrivilegioResDto)
  @Roles('SUPERADMIN')
  @Patch('id/:id')
  async updateLivelloPrivilegio(
    @AuthenticatedUser() user: User,
    @ReqTenant() tenant: Tenant,
    @Param('id', new ParseIntPipe()) livelloPrivilegioId: number,
    @Body() body: UpdateLivelloPrivilegioDto
  ) {
    const res = await this.livelliPrivilegioService.updateLivelloPrivilegio(user, livelloPrivilegioId, body);
    return res;
  }
}
