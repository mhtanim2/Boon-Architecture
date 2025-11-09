import { createZodDto } from '@anatine/zod-nestjs';
import {
  clienteResExcerptSchema,
  clienteResSchema,
  createClienteSchema,
  updateClienteSchema,
} from '@boon/interfaces/boon-api';

export class ClienteResDto extends createZodDto(clienteResSchema) {}
export class ClienteResExcerptDto extends createZodDto(clienteResExcerptSchema) {}

export class CreateClienteDto extends createZodDto(createClienteSchema) {}
export class UpdateClienteDto extends createZodDto(updateClienteSchema) {}
