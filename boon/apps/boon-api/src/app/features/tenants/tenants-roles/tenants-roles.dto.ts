import { createZodDto } from '@anatine/zod-nestjs';
import { ruoloResExcerptSchema, ruoloResSchema } from '@boon/interfaces/boon-api';

export class RuoloResDto extends createZodDto(ruoloResSchema) {}
export class RuoloResExcerptDto extends createZodDto(ruoloResExcerptSchema) {}
