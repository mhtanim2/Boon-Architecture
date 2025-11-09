import {
  Controller,
  Get,
  Headers,
  HttpStatus,
  NotFoundException,
  Param,
  Res,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Readable } from 'stream';
import { JwtAccessTokenAuthGuard } from '../auth/jwt-access-token-auth.guard';
import { PasswordMustNotBeResetGuard } from '../auth/password-must-not-be-reset.guard';
import { StorageGetObjectPathDto } from './storage.dto';
import { StorageService } from './storage.service';

@ApiTags('storage')
@Controller()
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get('/public/:wildcard')
  @ApiOperation({ summary: 'Retrieves an object' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successful response' })
  async getPublicObject(
    @Param() params: StorageGetObjectPathDto,
    @Headers() headers: Record<string, string>,
    @Res({ passthrough: true }) response: Response
  ) {
    params.wildcard = `public/${params.wildcard}`;
    return await this.getObject(params, headers, response);
  }

  @Get(':wildcard')
  @ApiOperation({ summary: 'Retrieves an object' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successful response' })
  @UseGuards(PasswordMustNotBeResetGuard)
  @UseGuards(JwtAccessTokenAuthGuard)
  @ApiCookieAuth()
  async getPrivateObject(
    @Param() params: StorageGetObjectPathDto,
    @Headers() headers: Record<string, string>,
    @Res({ passthrough: true }) response: Response
  ) {
    return await this.getObject(params, headers, response);
  }

  private async getObject(params: StorageGetObjectPathDto, headers: Record<string, string>, response: Response) {
    const { wildcard: url } = params;
    const res = await this.storageService.getFileByUrl(url, headers);

    if (!res.isOk) {
      throw new NotFoundException(`File '${url}' not found or inaccessible`, { cause: res.error });
    }

    response.status(HttpStatus.OK);
    for (const [key, value] of Object.entries(res.headers ?? {})) {
      response.setHeader(key, value);
    }
    return res.body instanceof Readable ? new StreamableFile(res.body) : res.body;
  }
}
