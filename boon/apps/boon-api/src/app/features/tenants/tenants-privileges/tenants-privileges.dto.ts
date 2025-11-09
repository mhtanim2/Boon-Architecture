import { createZodDto } from '@anatine/zod-nestjs';
import {
  livelloPrivilegioResExcerptSchema,
  livelloPrivilegioResSchema,
  privilegiByRuoloResExcerptSchema,
  privilegiByRuoloResSchema,
} from '@boon/interfaces/boon-api';

export class PrivilegiByRuoloResDto extends createZodDto(privilegiByRuoloResSchema) {}
export class PrivilegiByRuoloResExcerptDto extends createZodDto(privilegiByRuoloResExcerptSchema) {}

export class LivelliPrivilegiResDto extends createZodDto(livelloPrivilegioResSchema) {}
export class LivelliPrivilegiResExcerptDto extends createZodDto(livelloPrivilegioResExcerptSchema) {}
