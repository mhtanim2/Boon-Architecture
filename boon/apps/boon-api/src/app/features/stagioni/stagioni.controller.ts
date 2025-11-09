import { Tenant, User } from '@boon/interfaces/boon-api';

import { Body, Controller, Get, HttpStatus, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { PaginateQueryOptions } from '../../../decorators';
import { PrivilegesGuard } from '../../../guards/privileges.guard';
import { Roles, RolesGuard } from '../../../guards/roles.guard';
import { ZodSerializerDto } from '../../../zod/serializer';
import { JwtAccessTokenAuthGuard } from '../auth/jwt-access-token-auth.guard';
import { PasswordMustNotBeResetGuard } from '../auth/password-must-not-be-reset.guard';
import { AuthenticatedUser, ReqTenant } from '../auth/user-tenant.decorator';
import { StagioneResDto, StagioneResExcerptDto, UpdateStagioneDto } from './stagioni.dto';
import { StagioniService } from './stagioni.service';

@UseGuards(PrivilegesGuard)
@UseGuards(RolesGuard)
@UseGuards(PasswordMustNotBeResetGuard)
@UseGuards(JwtAccessTokenAuthGuard)
@ApiCookieAuth()
@ApiTags('admin/stagioni')
@Controller()
export class StagioniController {
  constructor(private readonly stagioniService: StagioniService) {}

  @PaginateQueryOptions(StagioneResExcerptDto, ['id', 'nome', 'descrizione'])
  @ZodSerializerDto(StagioneResExcerptDto, true)
  @Get()
  async findStagioni(
    @AuthenticatedUser() user: User,
    @Paginate() query: PaginateQuery
  ) {
    const res = await this.stagioniService.findStagioni(query);
    return res;
  }

  @ApiResponse({ status: HttpStatus.OK, description: 'Successful response', type: StagioneResDto })
  @ZodSerializerDto(StagioneResDto)
  @Get('id/:id')
  async findOneStagioneById(
    @AuthenticatedUser() user: User,
    @Param('id', new ParseIntPipe()) statoId: number
  ) {
    const res = await this.stagioniService.findOneStagioneById(statoId);
    return res;
  }

  @ApiResponse({ description: 'Successful response', type: StagioneResDto })
  @ZodSerializerDto(StagioneResDto)
  @Roles('SUPERADMIN')
  @Patch('id/:id')
  async updateStagione(
    @AuthenticatedUser() user: User,
    @Param('id', new ParseIntPipe()) stagioneId: number,
    @Body() body: UpdateStagioneDto
  ) {
    const res = await this.stagioniService.updateStagione(user, stagioneId, body);
    return res;
  }
}
