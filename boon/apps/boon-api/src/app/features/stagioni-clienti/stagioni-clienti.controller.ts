import { Tenant, User } from '@boon/interfaces/boon-api';

import { Body, Controller, Get, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { PaginateQueryOptions } from '../../../decorators';
import { PrivilegesGuard } from '../../../guards/privileges.guard';
import { Roles, RolesGuard } from '../../../guards/roles.guard';
import { ZodSerializerDto } from '../../../zod/serializer';
import { JwtAccessTokenAuthGuard } from '../auth/jwt-access-token-auth.guard';
import { PasswordMustNotBeResetGuard } from '../auth/password-must-not-be-reset.guard';
import { TenantMustBeSpecified, TenantMustBeSpecifiedGuard } from '../auth/tenant-must-be-specified.guard';
import { AuthenticatedUser, ReqTenant } from '../auth/user-tenant.decorator';
import {
  CreateStagioneClienteDto,
  StagioneClienteResDto,
  StagioneClienteResExcerptDto,
  UpdateStagioneClienteDto,
} from './stagioni-clienti.dto';
import { StagioniClientiService } from './stagioni-clienti.service';

@UseGuards(PrivilegesGuard)
@UseGuards(RolesGuard)
@UseGuards(PasswordMustNotBeResetGuard)
@UseGuards(JwtAccessTokenAuthGuard)
@ApiCookieAuth()
@ApiTags('admin/stagioni')
@Controller()
export class StagioniClientiController {
  constructor(private readonly stagioniclientiService: StagioniClientiService) {}

  @PaginateQueryOptions(StagioneClienteResExcerptDto, ['id', 'nome', 'descrizione'])
  @ZodSerializerDto(StagioneClienteResExcerptDto, true)
  @TenantMustBeSpecified()
  @UseGuards(TenantMustBeSpecifiedGuard)
  @Get()
  async findStagioniClienti(
    @AuthenticatedUser() user: User,
    @ReqTenant() tenant: Tenant,
    @Paginate() query: PaginateQuery
  ) {
    const res = await this.stagioniclientiService.findStagioniClienti(tenant, query);
    return res;
  }

  @ApiResponse({ status: HttpStatus.OK, description: 'Successful response', type: StagioneClienteResDto })
  @ZodSerializerDto(StagioneClienteResDto)
  @TenantMustBeSpecified()
  @UseGuards(TenantMustBeSpecifiedGuard)
  @Get('id/:id')
  async findOneStagioneClienteById(
    @AuthenticatedUser() user: User,
    @ReqTenant() tenant: Tenant,
    @Param('id', new ParseIntPipe()) statoId: number
  ) {
    const res = await this.stagioniclientiService.findOneStagioneClienteById(tenant, statoId);
    return res;
  }

  @ApiResponse({ description: 'Successful response', type: StagioneClienteResDto })
  @ZodSerializerDto(StagioneClienteResDto)
  @TenantMustBeSpecified()
  @UseGuards(TenantMustBeSpecifiedGuard)
  @Roles('SUPERADMIN')
  @Post()
  async createStagioneCliente(
    @AuthenticatedUser() user: User,
    @ReqTenant() tenant: Tenant,
    @Body() body: CreateStagioneClienteDto
  ) {
    const res = await this.stagioniclientiService.createStagioneCliente(tenant, user, body);
    return res;
  }

  @ApiResponse({ description: 'Successful response', type: StagioneClienteResDto })
  @ZodSerializerDto(StagioneClienteResDto)
  @TenantMustBeSpecified()
  @UseGuards(TenantMustBeSpecifiedGuard)
  @Roles('SUPERADMIN')
  @Patch('id/:id')
  async updateStagioneCliente(
    @AuthenticatedUser() user: User,
    @ReqTenant() tenant: Tenant,
    @Param('id', new ParseIntPipe()) stagioneClienteId: number,
    @Body() body: UpdateStagioneClienteDto
  ) {
    const res = await this.stagioniclientiService.updateStagioneCliente(tenant, user, stagioneClienteId, body);
    return res;
  }
}
