import { User } from '@boon/interfaces/boon-api';

import { Body, Controller, Get, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { PaginateQueryOptions } from '../../../decorators';
import { PrivilegesGuard } from '../../../guards/privileges.guard';
import { Roles, RolesGuard } from '../../../guards/roles.guard';
import { ZodSerializerDto } from '../../../zod/serializer';
import { JwtAccessTokenAuthGuard } from '../auth/jwt-access-token-auth.guard';
import { PasswordMustNotBeResetGuard } from '../auth/password-must-not-be-reset.guard';
import { AuthenticatedUser } from '../auth/user-tenant.decorator';
import { ClienteResDto, ClienteResExcerptDto, CreateClienteDto, UpdateClienteDto } from './clienti.dto';
import { ClientiService } from './clienti.service';

@UseGuards(PrivilegesGuard)
@UseGuards(RolesGuard)
@UseGuards(PasswordMustNotBeResetGuard)
@UseGuards(JwtAccessTokenAuthGuard)
@ApiCookieAuth()
@ApiTags('clienti')
@Controller()
export class ClientiController {
  constructor(private readonly clientiService: ClientiService) {}

  @PaginateQueryOptions(ClienteResExcerptDto, [
    'id',
    'ragioneSociale',
    'partitaIva',
    'codiceFiscale',
    'codiceSdi',
    'pec',
    'indirizzo',
    'cap',
    'telefono',
    'eMail',
    'web',
    'flagInterno',
    'luogo.codice',
    'tenant.slug',
  ])
  @ZodSerializerDto(ClienteResExcerptDto, true)
  @Get()
  async findClienti(@AuthenticatedUser() user: User, @Paginate() query: PaginateQuery) {
    const res = await this.clientiService.findClienti(query);
    return res;
  }

  @ApiResponse({ status: HttpStatus.OK, description: 'Successful response', type: ClienteResDto })
  @ZodSerializerDto(ClienteResDto)
  @Get('id/:id')
  async getOneClienteById(@AuthenticatedUser() user: User, @Param('id', new ParseIntPipe()) clienteId: number) {
    const res = await this.clientiService.getOneClienteById(clienteId);
    return res;
  }

  @ApiResponse({ description: 'Successful response', type: ClienteResDto })
  @ZodSerializerDto(ClienteResDto)
  @Roles('SUPERADMIN')
  @Post()
  async createCliente(@AuthenticatedUser() user: User, @Body() body: CreateClienteDto) {
    const res = await this.clientiService.createCliente(user, body);
    return res;
  }

  @ApiResponse({ description: 'Successful response', type: ClienteResDto })
  @ZodSerializerDto(ClienteResDto)
  @Roles('SUPERADMIN')
  @Patch('id/:id')
  async updateCliente(
    @AuthenticatedUser() user: User,
    @Param('id', new ParseIntPipe()) clienteId: number,
    @Body() body: UpdateClienteDto
  ) {
    const res = await this.clientiService.updateCliente(user, clienteId, body);
    return res;
  }
}
