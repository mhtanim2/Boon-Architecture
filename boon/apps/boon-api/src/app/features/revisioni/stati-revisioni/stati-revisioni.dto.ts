import { createZodDto } from '@anatine/zod-nestjs';
import {
  statoRevisioneResExcerptSchema,
  statoRevisioneResSchema,
  updateStatoRevisioneSchema,
} from '@boon/interfaces/boon-api';

export class StatoRevisioneResDto extends createZodDto(statoRevisioneResSchema) {}
export class StatoRevisioneResExcerptDto extends createZodDto(statoRevisioneResExcerptSchema) {}

export class UpdateStatoRevisioneDto extends createZodDto(updateStatoRevisioneSchema) {}
