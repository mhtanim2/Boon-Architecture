import { Tenant, User } from '@boon/interfaces/boon-api';
import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ZodSerializerDto } from '../../../zod/serializer';
import { JwtAccessTokenAuthGuard } from '../auth/jwt-access-token-auth.guard';
import { PasswordMustNotBeResetGuard } from '../auth/password-must-not-be-reset.guard';
import { TenantMustBeSpecified, TenantMustBeSpecifiedGuard } from '../auth/tenant-must-be-specified.guard';
import { AuthenticatedUser, ReqTenant } from '../auth/user-tenant.decorator';
import { TenantClienteResDto, TenantResDto } from './tenants.dto';
import { TenantsService } from './tenants.service';

@ApiTags('tenants')
@Controller()
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, description: 'Successful response', type: TenantResDto })
  @ZodSerializerDto(TenantResDto)
  @TenantMustBeSpecified()
  @UseGuards(TenantMustBeSpecifiedGuard)
  @Get()
  async getTenantInfo(@AuthenticatedUser() user: User, @ReqTenant() tenant: Tenant): Promise<TenantResDto> {
    return tenant;
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, description: 'Successful response', type: TenantClienteResDto, isArray: true })
  @ZodSerializerDto(TenantClienteResDto)
  @TenantMustBeSpecified()
  @UseGuards(PasswordMustNotBeResetGuard)
  @UseGuards(JwtAccessTokenAuthGuard)
  @UseGuards(TenantMustBeSpecifiedGuard)
  @ApiCookieAuth()
  @Get('clienti')
  async getClienti(@AuthenticatedUser() user: User, @ReqTenant() tenant: Tenant): Promise<TenantClienteResDto[]> {
    const res = await this.tenantsService.getClienti(tenant);
    return res;
  }
}
