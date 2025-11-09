import { Tenant, User } from '@boon/interfaces/boon-api';
import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ZodSerializerDto } from '../../../../zod/serializer';
import { JwtAccessTokenAuthGuard } from '../../auth/jwt-access-token-auth.guard';
import { PasswordMustNotBeResetGuard } from '../../auth/password-must-not-be-reset.guard';
import { TenantMustBeSpecified, TenantMustBeSpecifiedGuard } from '../../auth/tenant-must-be-specified.guard';
import { AuthenticatedUser, ReqTenant } from '../../auth/user-tenant.decorator';
import { FunzionalitaResDto } from './tenants-features.dto';
import { TenantsFeaturesService } from './tenants-features.service';

@ApiTags('tenants')
@Controller()
export class TenantsFeaturesController {
  constructor(private readonly tenantsFeaturesService: TenantsFeaturesService) {}

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, description: 'Successful response', type: FunzionalitaResDto, isArray: true })
  @ZodSerializerDto(FunzionalitaResDto)
  @TenantMustBeSpecified()
  @UseGuards(PasswordMustNotBeResetGuard)
  @UseGuards(JwtAccessTokenAuthGuard)
  @UseGuards(TenantMustBeSpecifiedGuard)
  @ApiCookieAuth()
  @Get()
  async getFunzionalita(@AuthenticatedUser() user: User, @ReqTenant() tenant: Tenant): Promise<FunzionalitaResDto[]> {
    const res = await this.tenantsFeaturesService.getFunzionalita(tenant.cliente.id);
    return res;
  }
}
