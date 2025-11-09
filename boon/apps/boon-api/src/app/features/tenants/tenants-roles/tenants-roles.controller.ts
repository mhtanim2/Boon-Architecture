import { Tenant, User } from '@boon/interfaces/boon-api';
import { Controller, Get, HttpStatus, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { PaginateQueryOptions } from '../../../../decorators';
import { ZodSerializerDto } from '../../../../zod/serializer';
import { JwtAccessTokenAuthGuard } from '../../auth/jwt-access-token-auth.guard';
import { PasswordMustNotBeResetGuard } from '../../auth/password-must-not-be-reset.guard';
import { TenantMustBeSpecified, TenantMustBeSpecifiedGuard } from '../../auth/tenant-must-be-specified.guard';
import { AuthenticatedUser, ReqTenant } from '../../auth/user-tenant.decorator';
import { RuoloResDto, RuoloResExcerptDto } from './tenants-roles.dto';
import { TenantsRolesService } from './tenants-roles.service';

@UseGuards(PasswordMustNotBeResetGuard)
@UseGuards(JwtAccessTokenAuthGuard)
@ApiCookieAuth()
@ApiTags('tenants')
@Controller()
export class TenantsRolesController {
  constructor(private readonly tenantsRolesService: TenantsRolesService) {}

  @PaginateQueryOptions(RuoloResExcerptDto, ['id', 'nome', 'descrizione'])
  @ZodSerializerDto(RuoloResExcerptDto, true)
  @TenantMustBeSpecified()
  @UseGuards(TenantMustBeSpecifiedGuard)
  @Get()
  async findTenantsRoles(
    @AuthenticatedUser() user: User,
    @ReqTenant() tenant: Tenant,
    @Paginate() query: PaginateQuery
  ) {
    const res = await this.tenantsRolesService.findRuoli(tenant, query);
    return res;
  }

  @ApiResponse({ status: HttpStatus.OK, description: 'Successful response' })
  @ZodSerializerDto(RuoloResDto)
  @TenantMustBeSpecified()
  @UseGuards(TenantMustBeSpecifiedGuard)
  @Get('id/:id')
  async findOneRuoloById(
    @AuthenticatedUser() user: User,
    @ReqTenant() tenant: Tenant,
    @Param('id', new ParseIntPipe()) statoId: number
  ) {
    const res = await this.tenantsRolesService.findOneRuoloById(tenant, statoId);
    return res;
  }
}
