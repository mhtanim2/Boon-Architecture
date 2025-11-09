import { Tenant, User } from '@boon/interfaces/boon-api';

import { Body, Controller, Get, HttpStatus, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { PaginateQueryOptions } from '../../../../decorators';
import { PrivilegesGuard } from '../../../../guards/privileges.guard';
import { Roles, RolesGuard } from '../../../../guards/roles.guard';
import { ZodSerializerDto } from '../../../../zod/serializer';
import { JwtAccessTokenAuthGuard } from '../../auth/jwt-access-token-auth.guard';
import { PasswordMustNotBeResetGuard } from '../../auth/password-must-not-be-reset.guard';
import { AuthenticatedUser, ReqTenant } from '../../auth/user-tenant.decorator';
import { StatoTemplateResDto, StatoTemplateResExcerptDto, UpdateStatoTemplateDto } from './stati-template.dto';
import { StatiTemplateService } from './stati-template.service';

@UseGuards(PrivilegesGuard)
@UseGuards(RolesGuard)
@UseGuards(PasswordMustNotBeResetGuard)
@UseGuards(JwtAccessTokenAuthGuard)
@ApiCookieAuth()
@ApiTags('template/stati-template')
@Controller()
export class StatiTemplateController {
  constructor(private readonly statiTemplateService: StatiTemplateService) {}

  @PaginateQueryOptions(StatoTemplateResExcerptDto, ['id', 'nome', 'descrizione'])
  @ZodSerializerDto(StatoTemplateResExcerptDto, true)
  @Get()
  async findStatiTemplate(
    @AuthenticatedUser() user: User,
    @ReqTenant() tenant: Tenant,
    @Paginate() query: PaginateQuery
  ) {
    const res = await this.statiTemplateService.findStatiTemplate(query);
    return res;
  }

  @ApiResponse({ status: HttpStatus.OK, description: 'Successful response', type: StatoTemplateResDto })
  @ZodSerializerDto(StatoTemplateResDto)
  @Get('id/:id')
  async findOneStatoTemplateById(
    @AuthenticatedUser() user: User,
    @ReqTenant() tenant: Tenant,
    @Param('id', new ParseIntPipe()) statoId: number
  ) {
    const res = await this.statiTemplateService.findOneStatoTemplateById(statoId);
    return res;
  }

  @ApiResponse({ description: 'Successful response', type: StatoTemplateResDto })
  @ZodSerializerDto(StatoTemplateResDto)
  @Roles('SUPERADMIN')
  @Patch('id/:id')
  async updateStatoTemplate(
    @AuthenticatedUser() user: User,
    @ReqTenant() tenant: Tenant,
    @Param('id', new ParseIntPipe()) statoTemplateId: number,
    @Body() body: UpdateStatoTemplateDto
  ) {
    const res = await this.statiTemplateService.updateStatoTemplate(user, statoTemplateId, body);
    return res;
  }
}
