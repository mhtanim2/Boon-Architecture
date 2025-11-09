import { User } from '@boon/interfaces/boon-api';

import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { PaginateQueryOptions } from '../../../decorators';
import { PrivilegesGuard } from '../../../guards/privileges.guard';
import { Roles, RolesGuard } from '../../../guards/roles.guard';
import { ZodSerializerDto } from '../../../zod/serializer';
import { JwtAccessTokenAuthGuard } from '../auth/jwt-access-token-auth.guard';
import { PasswordMustNotBeResetGuard } from '../auth/password-must-not-be-reset.guard';
import { AuthenticatedUser } from '../auth/user-tenant.decorator';
import { CreateUserDto, UpdateUserDto, UserResDto, UserResExcerptDto } from './users.dto';
import { UsersService } from './users.service';

@UseGuards(PrivilegesGuard)
@UseGuards(RolesGuard)
@UseGuards(PasswordMustNotBeResetGuard)
@UseGuards(JwtAccessTokenAuthGuard)
@ApiCookieAuth()
@ApiTags('users')
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @PaginateQueryOptions(UserResExcerptDto, [
    'id',
    'cognome',
    'nome',
    'username',
    'cliente.id',
    'stato.id',
    'profili.ruolo.id',
    'dataCreazione',
    'dataScadenza',
  ])
  @ZodSerializerDto(UserResExcerptDto, true)
  @Roles('SUPERADMIN')
  @Get()
  async findUsers(@AuthenticatedUser() user: User, @Paginate() query: PaginateQuery) {
    const res = await this.usersService.findUsers(query);
    return res;
  }

  @ApiResponse({ status: HttpStatus.OK, description: 'Successful response', type: UserResDto })
  @ZodSerializerDto(UserResDto)
  @Roles('SUPERADMIN')
  @Get('id/:id')
  async findOneUserById(@AuthenticatedUser() user: User, @Param('id', new ParseIntPipe()) accountId: number) {
    const res = await this.usersService.findOneUserById(accountId);
    return res;
  }

  @ApiResponse({ description: 'Successful response', type: UserResDto })
  @ZodSerializerDto(UserResDto)
  @Roles('SUPERADMIN')
  @Post()
  async createUser(@AuthenticatedUser() user: User, @Body() body: CreateUserDto) {
    const res = await this.usersService.createUser(user, body);
    return res;
  }

  @ApiResponse({ description: 'Successful response', type: UserResDto })
  @ZodSerializerDto(UserResDto)
  @Roles('SUPERADMIN')
  @Patch('id/:id')
  async updateUser(
    @AuthenticatedUser() user: User,
    @Param('id', new ParseIntPipe()) accountId: number,
    @Body() body: UpdateUserDto
  ) {
    const res = await this.usersService.updateUser(user, accountId, body);
    return res;
  }

  @ApiResponse({ description: 'Successful response', type: UserResDto })
  @ZodSerializerDto(UserResDto)
  @Roles('SUPERADMIN')
  @Delete('id/:id')
  async deleteUser(@AuthenticatedUser() user: User, @Param('id', new ParseIntPipe()) accountId: number) {
    const res = await this.usersService.deleteUser(user, accountId);
    return res;
  }

  @ApiResponse({ description: 'Successful response' })
  @Roles('SUPERADMIN')
  @Post('id/:id/challenges/email-verification')
  async createEmailVerificationChallengeForUser(
    @AuthenticatedUser() user: User,
    @Param('id', new ParseIntPipe()) accountId: number
  ) {
    const res = await this.usersService.createEmailVerificationChallengeForUser(user, accountId);
    return res;
  }
}
