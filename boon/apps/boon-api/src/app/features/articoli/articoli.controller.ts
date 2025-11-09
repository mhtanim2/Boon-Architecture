import { Tenant, User } from '@boon/interfaces/boon-api';
import {
  Body,
  Controller,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiCookieAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileExtensionsValidator } from '../../../files/file-extension-validator';
import { Privileges } from '../../../guards/privileges.guard';
import { ZodSerializerDto } from '../../../zod/serializer';
import { JwtAccessTokenAuthGuard } from '../auth/jwt-access-token-auth.guard';
import { PasswordMustNotBeResetGuard } from '../auth/password-must-not-be-reset.guard';
import { TenantMustBeSpecified } from '../auth/tenant-must-be-specified.guard';
import { AuthenticatedUser, ReqTenant } from '../auth/user-tenant.decorator';
import { FileUploadResDto } from '../file-uploads/file-uploads.dto';
import { FileUploadsService } from '../file-uploads/file-uploads.service';
import { BulkImportArticoliDto } from './articoli.dto';
import { ArticoliService } from './articoli.service';

const fileUploadParseFilePipe = new ParseFilePipe({
  validators: [
    new FileExtensionsValidator({
      fileExtensions: ['.xls', '.xlsx', '.xlm', '.xlsb'],
    }),
  ],
});

@UseGuards(PasswordMustNotBeResetGuard)
@UseGuards(JwtAccessTokenAuthGuard)
@ApiCookieAuth()
@ApiTags('articoli')
@Controller()
export class ArticoliController {
  constructor(
    private readonly articoliService: ArticoliService,
    private readonly fileUploadsService: FileUploadsService
  ) {}

  @ApiResponse({ description: 'Successful response', type: FileUploadResDto })
  @ZodSerializerDto(FileUploadResDto)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @Privileges('IMPORT ARTICLES')
  @TenantMustBeSpecified()
  @Post('bulk-import')
  async bulkImportArticoli(
    @AuthenticatedUser() user: User,
    @ReqTenant() tenant: Tenant,
    @Body() body: BulkImportArticoliDto,
    @UploadedFile(fileUploadParseFilePipe) file: Express.Multer.File
  ) {
    const fileUpload = await this.fileUploadsService.createFileUpload(user, tenant, body, file);
    const articoli = await this.articoliService.bulkImportArticoli(user, tenant, body, fileUpload);
    console.log('articoli imported: ', articoli.length);
    return fileUpload;
  }
}
