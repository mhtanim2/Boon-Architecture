import { createZodDto } from '@anatine/zod-nestjs';
import { tenantClienteResSchema, tenantResSchema } from '@boon/interfaces/boon-api';

export class TenantResDto extends createZodDto(tenantResSchema) {}
export class TenantClienteResDto extends createZodDto(tenantClienteResSchema) {}
