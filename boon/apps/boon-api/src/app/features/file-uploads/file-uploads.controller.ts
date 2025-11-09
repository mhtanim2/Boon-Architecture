import { Tenant, User } from '@boon/interfaces/boon-api';

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiCookieAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { PaginateQueryOptions } from '../../../decorators';
import { FileExtensionsValidator } from '../../../files/file-extension-validator';
import { Privileges, PrivilegesGuard } from '../../../guards/privileges.guard';
import { RolesGuard } from '../../../guards/roles.guard';
import { ZodSerializerDto } from '../../../zod/serializer';
import { JwtAccessTokenAuthGuard } from '../auth/jwt-access-token-auth.guard';
import { PasswordMustNotBeResetGuard } from '../auth/password-must-not-be-reset.guard';
import { TenantMustBeSpecified, TenantMustBeSpecifiedGuard } from '../auth/tenant-must-be-specified.guard';
import { AuthenticatedUser, ReqTenant } from '../auth/user-tenant.decorator';
import {
  CreateFileUploadDto,
  FileUploadResDto,
  FileUploadResExcerptDto,
  UpdateFileUploadDto,
} from './file-uploads.dto';
import { FileUploadsService } from './file-uploads.service';
import type { Response } from 'express';
import { createReadStream } from 'fs';

const fileUploadParseFilePipe = new ParseFilePipe({
  validators: [
    new FileExtensionsValidator({
      fileExtensions: ['.xls', '.xlsx', '.xlm', '.xlsb'],
    }),
  ],
});
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

@UseGuards(PrivilegesGuard)
@UseGuards(RolesGuard)
@UseGuards(TenantMustBeSpecifiedGuard)
@UseGuards(PasswordMustNotBeResetGuard)
@UseGuards(JwtAccessTokenAuthGuard)
@ApiCookieAuth()
@ApiTags('file-uploads')
@Controller()
export class FileUploadsController {

  constructor(private readonly fileUploadsService: FileUploadsService) {}

  @PaginateQueryOptions(FileUploadResExcerptDto, [
    'id',
    'template.nome',
    'uploader.username',
    'template.funzionalita.id',
    'dataOra',
    'ultimaModifica',
    'nomeFile',
    'dimensione',
  ])
  @ZodSerializerDto(FileUploadResExcerptDto, true)
  @Privileges('IMPORT ARTICLES', 'IMPORT SHOOTING')
  @TenantMustBeSpecified()
  @Get()
  async findFileUploads(
    @AuthenticatedUser() user: User,
    @ReqTenant() tenant: Tenant,
    @Paginate() query: PaginateQuery
  ) {
    const res = await this.fileUploadsService.findFileUpload(tenant, query);
    return res;
  }

  @ApiResponse({ status: HttpStatus.OK, description: 'Successful response' })
  @ZodSerializerDto(FileUploadResDto)
  @Privileges('IMPORT ARTICLES', 'IMPORT SHOOTING')
  @TenantMustBeSpecified()
  @Get('id/:id')
  async findOneFileUploadById(
    @AuthenticatedUser() user: User,
    @ReqTenant() tenant: Tenant,
    @Param('id', new ParseIntPipe()) fileUploadId: number
  ) {
    const res = await this.fileUploadsService.findOneFileUploadById(tenant, fileUploadId);
    return res;
  }

  @ApiResponse({ status: HttpStatus.OK, description: 'Successful response' })
  @ZodSerializerDto(FileUploadResDto)
  @Privileges('IMPORT ARTICLES', 'IMPORT SHOOTING')
  @TenantMustBeSpecified()
  @Get('id/:id/download')
  async downloadOneFileUploadById(
    @AuthenticatedUser() user: User,
    @ReqTenant() tenant: Tenant,
    @Param('id', new ParseIntPipe()) fileUploadId: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { filepath, fileUpload } = await this.fileUploadsService.downloadOneFileUploadById(tenant, fileUploadId);
    console.log(filepath);
    const file = createReadStream(filepath);

    res.set({
      'Content-Type': EXCEL_TYPE,
      'Content-Disposition': `attachment; filename="${fileUpload.nomeFile}"`,
    });
    return new StreamableFile(file);
  }


  @ApiResponse({ description: 'Successful response', type: FileUploadResDto })
  @ZodSerializerDto(FileUploadResDto)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @Privileges('IMPORT ARTICLES', 'IMPORT SHOOTING')
  @TenantMustBeSpecified()
  @Post()
  async createFileUpload(
    @AuthenticatedUser() user: User,
    @ReqTenant() tenant: Tenant,
    @Body() body: CreateFileUploadDto,
    @UploadedFile(fileUploadParseFilePipe) file: Express.Multer.File
  ) {
    const res = await this.fileUploadsService.createFileUpload(user, tenant, body, file);
    return res;
  }

  @ApiResponse({ description: 'Successful response', type: FileUploadResDto })
  @ZodSerializerDto(FileUploadResDto)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @Privileges('IMPORT ARTICLES', 'IMPORT SHOOTING')
  @TenantMustBeSpecified()
  @Patch('id/:id')
  async updateFileUpload(
    @AuthenticatedUser() user: User,
    @ReqTenant() tenant: Tenant,
    @Param('id', new ParseIntPipe()) fileUploadId: number,
    @Body() body: UpdateFileUploadDto,
    @UploadedFile(fileUploadParseFilePipe) file: Express.Multer.File | undefined
  ) {
    const res = await this.fileUploadsService.updateFileUpload(user, tenant, fileUploadId, body, file);
    return res;
  }

  @ApiResponse({ description: 'Successful response', type: FileUploadResDto })
  @ZodSerializerDto(FileUploadResDto)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @Privileges('IMPORT ARTICLES', 'IMPORT SHOOTING')
  @TenantMustBeSpecified()
  @Delete('id/:id')
  async deleteFileUpload(
    @AuthenticatedUser() user: User,
    @ReqTenant() tenant: Tenant,
    @Param('id', new ParseIntPipe()) fileUploadId: number
  ) {
    const res = await this.fileUploadsService.deleteFileUpload(user, tenant, fileUploadId);
    return res;
  }
}
