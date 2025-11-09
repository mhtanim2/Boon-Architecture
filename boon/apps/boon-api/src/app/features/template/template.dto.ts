import { createZodDto } from '@anatine/zod-nestjs';
import {
  createTemplateSchema,
  templateResExcerptSchema,
  templateResSchema,
  updateTemplateSchema,
} from '@boon/interfaces/boon-api';

export class TemplateResDto extends createZodDto(templateResSchema) {}
export class TemplateResExcerptDto extends createZodDto(templateResExcerptSchema) {}

export class CreateTemplateDto extends createZodDto(createTemplateSchema) {}
export class UpdateTemplateDto extends createZodDto(updateTemplateSchema) {}
