import { createZodDto } from '@anatine/zod-nestjs';
import {
  stagioneResExcerptSchema,
  stagioneResSchema,
  updateStagioneSchema,
} from '@boon/interfaces/boon-api';

export class StagioneResDto extends createZodDto(stagioneResSchema) {}
export class StagioneResExcerptDto extends createZodDto(stagioneResExcerptSchema) {}

export class UpdateStagioneDto extends createZodDto(updateStagioneSchema) {}
