import { ZodDtoStatic } from '@anatine/zod-nestjs';
import { HTTP_ERRORS_BY_CODE } from '@anatine/zod-nestjs/src/lib/http-errors';
import { CanActivate, ExecutionContext, HttpStatus, Injectable, UseGuards } from '@nestjs/common';
import { ZodSchema } from 'zod';
import { validate } from './utils';

export type Source = 'body' | 'query' | 'params';

type ZodGuardClass = new (source: Source, schemaOrDto: ZodSchema | ZodDtoStatic) => CanActivate;

export interface ZodGuardOptions {
  errorHttpStatusCode?: keyof typeof HTTP_ERRORS_BY_CODE;
}

export function createZodGuard(options?: ZodGuardOptions): ZodGuardClass {
  @Injectable()
  class ZodGuard {
    private readonly errorHttpStatusCode: keyof typeof HTTP_ERRORS_BY_CODE;

    constructor(private source: Source, private schemaOrDto: ZodSchema | ZodDtoStatic) {
      this.errorHttpStatusCode = options?.errorHttpStatusCode || HttpStatus.BAD_REQUEST;
    }

    canActivate(context: ExecutionContext) {
      const value = context.switchToHttp().getRequest()[this.source];
      const parseResult = validate(this.schemaOrDto, value, this.errorHttpStatusCode);
      return parseResult.success;
    }
  }

  return ZodGuard;
}

export const UseZodGuard = (source: Source, schemaOrDto: ZodSchema | ZodDtoStatic, options?: ZodGuardOptions) =>
  UseGuards(new (createZodGuard(options))(source, schemaOrDto));
