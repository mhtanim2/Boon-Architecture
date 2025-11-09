import { createZodDto } from '@anatine/zod-nestjs';
import {
  createStagioneClienteSchema,
  stagioneClienteResExcerptSchema,
  stagioneClienteResSchema,
  updateStagioneClienteSchema,
} from '@boon/interfaces/boon-api';

export class StagioneClienteResDto extends createZodDto(stagioneClienteResExcerptSchema) {}
export class StagioneClienteResExcerptDto extends createZodDto(stagioneClienteResSchema) {}

export class CreateStagioneClienteDto extends createZodDto(createStagioneClienteSchema) {}
export class UpdateStagioneClienteDto extends createZodDto(updateStagioneClienteSchema) {}
