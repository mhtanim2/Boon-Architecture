import { ZodDtoStatic } from '@anatine/zod-nestjs';
import { HTTP_ERRORS_BY_CODE } from '@anatine/zod-nestjs/src/lib/http-errors';
import { HttpStatus } from '@nestjs/common';
import { ZodSchema } from 'zod/lib';

export function isZodDto(metatype: unknown): metatype is ZodDtoStatic<any> {
  return !!(metatype as ZodDtoStatic)?.zodSchema;
}

export function validate(
  schemaOrDto: ZodDtoStatic | ZodSchema,
  value: any,
  httpStatusCodeOnError: keyof typeof HTTP_ERRORS_BY_CODE = HttpStatus.BAD_REQUEST
) {
  const schema = isZodDto(schemaOrDto) ? schemaOrDto.zodSchema : schemaOrDto;
  const parseResult = schema.safeParse(value);
  if (!parseResult.success) {
    const { error } = parseResult;
    const message = error.errors.map((error) => `${error.path.join('.')}: ${error.message}`);

    throw new HTTP_ERRORS_BY_CODE[httpStatusCodeOnError](message);
  }
  return parseResult;
}

export function validateInterally(
  schemaOrDto: ZodDtoStatic | ZodSchema,
  value: any,
  httpStatusCodeOnError: keyof typeof HTTP_ERRORS_BY_CODE = HttpStatus.INTERNAL_SERVER_ERROR
) {
  const schema = isZodDto(schemaOrDto) ? schemaOrDto.zodSchema : schemaOrDto;
  const parseResult = schema.safeParse(value);
  if (!parseResult.success) {
    const { error } = parseResult;
    const message = error.errors.map((error) => `${error.path.join('.')}: ${error.message}`);

    console.error(
      `Error while validating dto '${isZodDto(schemaOrDto) ? schemaOrDto.name : 'unknownSchema'}': ${message}`
    );
    console.error('value', value);
    throw new HTTP_ERRORS_BY_CODE[httpStatusCodeOnError]();
  }
  return parseResult;
}
