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
import { StatoRevisioneResDto, StatoRevisioneResExcerptDto, UpdateStatoRevisioneDto } from './stati-revisioni.dto';
import { StatiRevisioniService } from './stati-revisioni.service';

@UseGuards(PrivilegesGuard)
@UseGuards(RolesGuard)
@UseGuards(PasswordMustNotBeResetGuard)
@UseGuards(JwtAccessTokenAuthGuard)
@ApiCookieAuth()
@ApiTags('revisioni/stati-revisioni')
@Controller()
export class StatiRevisioniController {
  constructor(private readonly statiRevisioniService: StatiRevisioniService) {}

  @PaginateQueryOptions(StatoRevisioneResExcerptDto, ['id', 'nome', 'descrizione'])
  @ZodSerializerDto(StatoRevisioneResExcerptDto, true)
  @Get()
  async findStatiRevisioni(
    @AuthenticatedUser() user: User,
    @ReqTenant() tenant: Tenant,
    @Paginate() query: PaginateQuery
  ) {
    const res = await this.statiRevisioniService.findStatiRevisioni(query);
    return res;
  }

  @ApiResponse({ status: HttpStatus.OK, description: 'Successful response', type: StatoRevisioneResDto })
  @ZodSerializerDto(StatoRevisioneResDto)
  @Get('id/:id')
  async findOneStatoRevisioniById(
    @AuthenticatedUser() user: User,
    @ReqTenant() tenant: Tenant,
    @Param('id', new ParseIntPipe()) statoId: number
  ) {
    const res = await this.statiRevisioniService.findOneStatoRevisioniById(statoId);
    return res;
  }

  @ApiResponse({ description: 'Successful response', type: StatoRevisioneResDto })
  @ZodSerializerDto(StatoRevisioneResDto)
  @Roles('SUPERADMIN')
  @Patch('id/:id')
  async updateStatoRevisione(
    @AuthenticatedUser() user: User,
    @ReqTenant() tenant: Tenant,
    @Param('id', new ParseIntPipe()) statoRevisioneId: number,
    @Body() body: UpdateStatoRevisioneDto
  ) {
    const res = await this.statiRevisioniService.updateStatoRevisione(user, statoRevisioneId, body);
    return res;
  }
}
