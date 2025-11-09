import { User } from '@boon/interfaces/boon-api';
import { Controller, Get, HttpStatus, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { PaginateQueryOptions } from '../../../decorators';
import { PrivilegesGuard } from '../../../guards/privileges.guard';
import { RolesGuard } from '../../../guards/roles.guard';
import { ZodSerializerDto } from '../../../zod/serializer';
import { JwtAccessTokenAuthGuard } from '../auth/jwt-access-token-auth.guard';
import { PasswordMustNotBeResetGuard } from '../auth/password-must-not-be-reset.guard';
import { AuthenticatedUser } from '../auth/user-tenant.decorator';
import { RuoloResDto, RuoloResExcerptDto } from './ruoli.dto';
import { RuoliService } from './ruoli.service';

@UseGuards(PrivilegesGuard)
@UseGuards(RolesGuard)
@UseGuards(PasswordMustNotBeResetGuard)
@UseGuards(JwtAccessTokenAuthGuard)
@ApiCookieAuth()
@ApiTags('privilegi')
@Controller()
export class RuoliController {
  constructor(private readonly ruoliService: RuoliService) {}

  @PaginateQueryOptions(RuoloResExcerptDto, ['id', 'nome', 'descrizione'])
  @ZodSerializerDto(RuoloResExcerptDto, true)
  @Get()
  async findRuoli(@AuthenticatedUser() user: User, @Paginate() query: PaginateQuery) {
    const res = await this.ruoliService.findRuoli(query);
    return res;
  }

  @ApiResponse({ status: HttpStatus.OK, description: 'Successful response' })
  @ZodSerializerDto(RuoloResDto)
  @Get('id/:id')
  async findOneRuoloById(@AuthenticatedUser() user: User, @Param('id', new ParseIntPipe()) statoId: number) {
    const res = await this.ruoliService.findOneRuoloById(statoId);
    return res;
  }
}
