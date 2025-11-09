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
import { GenereResDto, GenereResExcerptDto, UpdateGenereDto } from './generi.dto';
import { GeneriService } from './generi.service';

@UseGuards(PrivilegesGuard)
@UseGuards(RolesGuard)
@UseGuards(PasswordMustNotBeResetGuard)
@UseGuards(JwtAccessTokenAuthGuard)
@ApiCookieAuth()
@ApiTags('admin/generi')
@Controller()
export class GeneriController {
  constructor(private readonly generiService: GeneriService) {}

  @PaginateQueryOptions(GenereResExcerptDto, ['id', 'nome', 'descrizione'])
  @ZodSerializerDto(GenereResExcerptDto, true)
  @Get()
  async findGeneri(
    @AuthenticatedUser() user: User,
    @Paginate() query: PaginateQuery
  ) {
    const res = await this.generiService.findGeneri(query);
    return res;
  }

  @ApiResponse({ status: HttpStatus.OK, description: 'Successful response', type: GenereResDto })
  @ZodSerializerDto(GenereResDto)
  @Get('id/:id')
  async findOneGenereById(
    @AuthenticatedUser() user: User,
    @Param('id', new ParseIntPipe()) statoId: number
  ) {
    const res = await this.generiService.findOneGenereById(statoId);
    return res;
  }

  @ApiResponse({ description: 'Successful response', type: GenereResDto })
  @ZodSerializerDto(GenereResDto)
  @Roles('SUPERADMIN')
  @Patch('id/:id')
  async updateGenere(
    @AuthenticatedUser() user: User,
    @Param('id', new ParseIntPipe()) genereId: number,
    @Body() body: UpdateGenereDto
  ) {
    const res = await this.generiService.updateGenere(user, genereId, body);
    return res;
  }
}
