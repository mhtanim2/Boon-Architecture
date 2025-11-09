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
import { StatoAccountResDto, StatoAccountResExcerptDto, UpdateStatoAccountDto } from './stati-accounts.dto';
import { StatiAccountsService } from './stati-accounts.service';

@UseGuards(PrivilegesGuard)
@UseGuards(RolesGuard)
@UseGuards(PasswordMustNotBeResetGuard)
@UseGuards(JwtAccessTokenAuthGuard)
@ApiCookieAuth()
@ApiTags('users/stati-accounts')
@Controller()
export class StatiAccountsController {
  constructor(private readonly statiAccountsService: StatiAccountsService) {}

  @PaginateQueryOptions(StatoAccountResExcerptDto, ['id', 'nome', 'descrizione'])
  @ZodSerializerDto(StatoAccountResExcerptDto, true)
  @Get()
  async findStatiAccounts(
    @AuthenticatedUser() user: User,
    @ReqTenant() tenant: Tenant,
    @Paginate() query: PaginateQuery
  ) {
    const res = await this.statiAccountsService.findStatiAccounts(query);
    return res;
  }

  @ApiResponse({ status: HttpStatus.OK, description: 'Successful response', type: StatoAccountResDto })
  @ZodSerializerDto(StatoAccountResDto)
  @Get('id/:id')
  async findOneStatoAccountsById(
    @AuthenticatedUser() user: User,
    @ReqTenant() tenant: Tenant,
    @Param('id', new ParseIntPipe()) statoId: number
  ) {
    const res = await this.statiAccountsService.findOneStatoAccountsById(statoId);
    return res;
  }

  @ApiResponse({ description: 'Successful response', type: StatoAccountResDto })
  @ZodSerializerDto(StatoAccountResDto)
  @Roles('SUPERADMIN')
  @Patch('id/:id')
  async updateStatoAccount(
    @AuthenticatedUser() user: User,
    @ReqTenant() tenant: Tenant,
    @Param('id', new ParseIntPipe()) statoAccountId: number,
    @Body() body: UpdateStatoAccountDto
  ) {
    const res = await this.statiAccountsService.updateStatoAccount(user, statoAccountId, body);
    return res;
  }
}
