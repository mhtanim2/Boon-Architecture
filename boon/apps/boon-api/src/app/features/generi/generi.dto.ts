import { createZodDto } from '@anatine/zod-nestjs';
import {
  genereResExcerptSchema,
  genereResSchema,
  updateGenereSchema,
} from '@boon/interfaces/boon-api';

export class GenereResDto extends createZodDto(genereResSchema) {}
export class GenereResExcerptDto extends createZodDto(genereResExcerptSchema) {}

export class UpdateGenereDto extends createZodDto(updateGenereSchema) {}
