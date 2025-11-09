import { createZodDto } from '@anatine/zod-nestjs';
import {
  statoTemplateResExcerptSchema,
  statoTemplateResSchema,
  updateStatoTemplateSchema,
} from '@boon/interfaces/boon-api';

export class StatoTemplateResDto extends createZodDto(statoTemplateResSchema) {}
export class StatoTemplateResExcerptDto extends createZodDto(statoTemplateResExcerptSchema) {}

export class UpdateStatoTemplateDto extends createZodDto(updateStatoTemplateSchema) {}
