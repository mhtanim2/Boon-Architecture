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
import { StatoArticoloResDto, StatoArticoloResExcerptDto, UpdateStatoArticoloDto } from './stati-articoli.dto';
import { StatiArticoliService } from './stati-articoli.service';

@UseGuards(PrivilegesGuard)
@UseGuards(RolesGuard)
@UseGuards(PasswordMustNotBeResetGuard)
@UseGuards(JwtAccessTokenAuthGuard)
@ApiCookieAuth()
@ApiTags('articoli/stati-articoli')
@Controller()
export class StatiArticoliController {
  constructor(private readonly statiArticoliService: StatiArticoliService) {}

  @PaginateQueryOptions(StatoArticoloResExcerptDto, ['id', 'nome', 'descrizione'])
  @ZodSerializerDto(StatoArticoloResExcerptDto, true)
  @Get()
  async findStatiArticoli(
    @AuthenticatedUser() user: User,
    @ReqTenant() tenant: Tenant,
    @Paginate() query: PaginateQuery
  ) {
    const res = await this.statiArticoliService.findStatiArticoli(query);
    return res;
  }

  @ApiResponse({ status: HttpStatus.OK, description: 'Successful response', type: StatoArticoloResDto })
  @ZodSerializerDto(StatoArticoloResDto)
  @Get('id/:id')
  async findOneStatoArticoliById(
    @AuthenticatedUser() user: User,
    @ReqTenant() tenant: Tenant,
    @Param('id', new ParseIntPipe()) statoId: number
  ) {
    const res = await this.statiArticoliService.findOneStatoArticoliById(statoId);
    return res;
  }

  @ApiResponse({ description: 'Successful response', type: StatoArticoloResDto })
  @ZodSerializerDto(StatoArticoloResDto)
  @Roles('SUPERADMIN')
  @Patch('id/:id')
  async updateStatoArticolo(
    @AuthenticatedUser() user: User,
    @ReqTenant() tenant: Tenant,
    @Param('id', new ParseIntPipe()) statoArticoloId: number,
    @Body() body: UpdateStatoArticoloDto
  ) {
    const res = await this.statiArticoliService.updateStatoArticolo(user, statoArticoloId, body);
    return res;
  }
}
