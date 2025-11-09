import { createZodDto } from '@anatine/zod-nestjs';
import { funzionalitaResExcerptSchema, funzionalitaResSchema } from '@boon/interfaces/boon-api';

export class FunzionalitaResDto extends createZodDto(funzionalitaResSchema) {}
export class FunzionalitaResExcerptDto extends createZodDto(funzionalitaResExcerptSchema) {}
