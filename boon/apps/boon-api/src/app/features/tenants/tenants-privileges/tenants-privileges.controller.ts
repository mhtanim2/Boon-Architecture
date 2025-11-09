import { Tenant, User } from '@boon/interfaces/boon-api';

import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { PaginateQueryOptions } from '../../../../decorators';
import { ZodSerializerDto } from '../../../../zod/serializer';
import { JwtAccessTokenAuthGuard } from '../../auth/jwt-access-token-auth.guard';
import { PasswordMustNotBeResetGuard } from '../../auth/password-must-not-be-reset.guard';
import { TenantMustBeSpecified, TenantMustBeSpecifiedGuard } from '../../auth/tenant-must-be-specified.guard';
import { AuthenticatedUser, ReqTenant } from '../../auth/user-tenant.decorator';
import { LivelliPrivilegiResExcerptDto, PrivilegiByRuoloResExcerptDto } from './tenants-privileges.dto';
import { TenantsPrivilegesService } from './tenants-privileges.service';

@ApiTags('tenants')
@Controller()
export class TenantsPrivilegesController {
  constructor(private readonly tenantsPrivilegesService: TenantsPrivilegesService) {}

  @HttpCode(HttpStatus.OK)
  @PaginateQueryOptions(PrivilegiByRuoloResExcerptDto, ['funzionalita.id', 'funzionalita.nome', 'ruolo.id'], {
    isPaginated: false,
  })
  @ZodSerializerDto(PrivilegiByRuoloResExcerptDto)
  @TenantMustBeSpecified()
  @UseGuards(PasswordMustNotBeResetGuard)
  @UseGuards(JwtAccessTokenAuthGuard)
  @UseGuards(TenantMustBeSpecifiedGuard)
  @ApiCookieAuth()
  @Get()
  async getPrivilegesByRoles(
    @AuthenticatedUser() user: User,
    @ReqTenant() tenant: Tenant,
    @Paginate() query: PaginateQuery
  ) {
    const res = await this.tenantsPrivilegesService.getPrivilegesByRoles(tenant.cliente.id, query);
    return res;
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful response',
    type: LivelliPrivilegiResExcerptDto,
    isArray: true,
  })
  @ZodSerializerDto(LivelliPrivilegiResExcerptDto)
  @TenantMustBeSpecified()
  @UseGuards(PasswordMustNotBeResetGuard)
  @UseGuards(JwtAccessTokenAuthGuard)
  @UseGuards(TenantMustBeSpecifiedGuard)
  @ApiCookieAuth()
  @Get('levels')
  async getPermissionsLevels(
    @AuthenticatedUser() user: User,
    @ReqTenant() tenant: Tenant
  ): Promise<LivelliPrivilegiResExcerptDto[]> {
    const res = await this.tenantsPrivilegesService.getPermissionsLevels();
    return res;
  }
}
