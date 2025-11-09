import { Tenant, User } from '@boon/interfaces/boon-api';
import { Controller, Get, HttpStatus, Param, ParseIntPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { PaginateQueryOptions } from '../../../decorators';
import { ZodSerializerDto } from '../../../zod/serializer';
import { AuthenticatedUser, ReqTenant } from '../auth/user-tenant.decorator';
import { LivelloPrivilegioResDto } from './livelli-privilegio.dto';
import { LivelliPrivilegioService } from './livelli-privilegio.service';

@ApiTags('privilegi')
@Controller()
export class LivelliPrivilegioPublicController {
  constructor(private readonly livelliPrivilegioService: LivelliPrivilegioService) {}

  @PaginateQueryOptions(LivelloPrivilegioResDto, ['id', 'nome', 'descrizione'])
  @ZodSerializerDto(LivelloPrivilegioResDto, true)
  @Get()
  async findLivelliPrivilegio(
    @AuthenticatedUser() user: User,
    @ReqTenant() tenant: Tenant,
    @Paginate() query: PaginateQuery
  ) {
    const res = await this.livelliPrivilegioService.findLivelliPrivilegio(query);
    return res;
  }

  @ApiResponse({ status: HttpStatus.OK, description: 'Successful response', type: LivelloPrivilegioResDto })
  @ZodSerializerDto(LivelloPrivilegioResDto)
  @Get('id/:id')
  async findOneLivelloPrivilegioById(
    @AuthenticatedUser() user: User,
    @ReqTenant() tenant: Tenant,
    @Param('id', new ParseIntPipe()) livelloPrivilegioId: number
  ) {
    const res = await this.livelliPrivilegioService.findOneLivelloPrivilegioById(livelloPrivilegioId);
    return res;
  }
}
