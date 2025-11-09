import { createZodDto } from '@anatine/zod-nestjs';
import {
  statoAccountResExcerptSchema,
  statoAccountResSchema,
  updateStatoAccountSchema,
} from '@boon/interfaces/boon-api';

export class StatoAccountResDto extends createZodDto(statoAccountResSchema) {}
export class StatoAccountResExcerptDto extends createZodDto(statoAccountResExcerptSchema) {}

export class UpdateStatoAccountDto extends createZodDto(updateStatoAccountSchema) {}
