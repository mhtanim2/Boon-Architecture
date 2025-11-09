import { createZodDto } from '@anatine/zod-nestjs';
import {
  statoArticoloResExcerptSchema,
  statoArticoloResSchema,
  updateStatoArticoloSchema,
} from '@boon/interfaces/boon-api';

export class StatoArticoloResDto extends createZodDto(statoArticoloResSchema) {}
export class StatoArticoloResExcerptDto extends createZodDto(statoArticoloResExcerptSchema) {}

export class UpdateStatoArticoloDto extends createZodDto(updateStatoArticoloSchema) {}
