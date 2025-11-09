import { Tenant, User } from '@boon/interfaces/boon-api';

import { Body, Controller, Get, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { PaginateQueryOptions } from '../../../decorators';
import { PrivilegesGuard } from '../../../guards/privileges.guard';
import { Roles, RolesGuard } from '../../../guards/roles.guard';
import { ZodSerializerDto } from '../../../zod/serializer';
import { JwtAccessTokenAuthGuard } from '../auth/jwt-access-token-auth.guard';
import { PasswordMustNotBeResetGuard } from '../auth/password-must-not-be-reset.guard';
import { TenantMustBeSpecified, TenantMustBeSpecifiedGuard } from '../auth/tenant-must-be-specified.guard';
import { AuthenticatedUser, ReqTenant } from '../auth/user-tenant.decorator';
import { CreateTemplateDto, TemplateResDto, TemplateResExcerptDto, UpdateTemplateDto } from './template.dto';
import { TemplateService } from './template.service';

@UseGuards(PrivilegesGuard)
@UseGuards(RolesGuard)
@UseGuards(PasswordMustNotBeResetGuard)
@UseGuards(JwtAccessTokenAuthGuard)
@ApiCookieAuth()
@ApiTags('template')
@Controller()
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @PaginateQueryOptions(TemplateResExcerptDto, ['id', 'cliente.id', 'stato.id', 'funzionalita.id', 'nome'])
  @ZodSerializerDto(TemplateResExcerptDto, true)
  @TenantMustBeSpecified()
  @UseGuards(TenantMustBeSpecifiedGuard)
  @Get()
  async findTemplate(@AuthenticatedUser() user: User, @ReqTenant() tenant: Tenant, @Paginate() query: PaginateQuery) {
    const res = await this.templateService.findTemplate(tenant, query);
    return res;
  }

  @ApiResponse({ status: HttpStatus.OK, description: 'Successful response', type: TemplateResDto })
  @ZodSerializerDto(TemplateResDto)
  @TenantMustBeSpecified()
  @UseGuards(TenantMustBeSpecifiedGuard)
  @Get('id/:id')
  async findOneTemplateById(
    @AuthenticatedUser() user: User,
    @ReqTenant() tenant: Tenant,
    @Param('id', new ParseIntPipe()) templateId: number
  ) {
    const res = await this.templateService.findOneTemplateById(tenant, templateId);
    return res;
  }

  @ApiResponse({ description: 'Successful response', type: TemplateResDto })
  @ZodSerializerDto(TemplateResDto)
  @TenantMustBeSpecified()
  @UseGuards(TenantMustBeSpecifiedGuard)
  @Roles('SUPERADMIN')
  @Post()
  async createTemplate(@AuthenticatedUser() user: User, @ReqTenant() tenant: Tenant, @Body() body: CreateTemplateDto) {
    const res = await this.templateService.createTemplate(tenant, user, body);
    return res;
  }

  @ApiResponse({ description: 'Successful response', type: TemplateResDto })
  @ZodSerializerDto(TemplateResDto)
  @TenantMustBeSpecified()
  @UseGuards(TenantMustBeSpecifiedGuard)
  @Roles('SUPERADMIN')
  @Patch('id/:id')
  async updateTemplate(
    @AuthenticatedUser() user: User,
    @ReqTenant() tenant: Tenant,
    @Param('id', new ParseIntPipe()) templateId: number,
    @Body() body: UpdateTemplateDto
  ) {
    const res = await this.templateService.updateTemplate(tenant, user, templateId, body);
    return res;
  }
}
