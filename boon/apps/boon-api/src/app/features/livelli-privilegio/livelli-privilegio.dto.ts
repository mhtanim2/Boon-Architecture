import { createZodDto } from '@anatine/zod-nestjs';
import {
  livelloPrivilegioResExcerptSchema,
  livelloPrivilegioResSchema,
  updateLivelloPrivilegioSchema,
} from '@boon/interfaces/boon-api';

export class LivelloPrivilegioResDto extends createZodDto(livelloPrivilegioResSchema) {}
export class LivelloPrivilegioResExcerptDto extends createZodDto(livelloPrivilegioResExcerptSchema) {}

export class UpdateLivelloPrivilegioDto extends createZodDto(updateLivelloPrivilegioSchema) {}
