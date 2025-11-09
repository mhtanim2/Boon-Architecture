import { boonClientiSchema, boonTenantsSchema } from '@boon/interfaces/database';
import { z } from 'zod';

export const tenantClienteSchema = boonClientiSchema
  .pick({ id: true, ragioneSociale: true, flagInterno: true })
  .extend({
    tenant: boonTenantsSchema.omit({ idCliente: true }),
  });
export type TenantCliente = z.infer<typeof tenantClienteSchema>;

export const tenantClienteResSchema = tenantClienteSchema.omit({ flagInterno: true });
export type TenantClienteRes = z.infer<typeof tenantClienteResSchema>;

export const tenantSchema = boonTenantsSchema
  .omit({
    idCliente: true,
  })
  .extend({
    cliente: tenantClienteSchema.omit({ tenant: true }),
  });
export type Tenant = z.infer<typeof tenantSchema>;

export const tenantResSchema = tenantSchema.extend({
  cliente: tenantClienteResSchema.omit({ tenant: true }),
});
export type TenantRes = z.infer<typeof tenantResSchema>;
