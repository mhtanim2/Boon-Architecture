import { z } from 'zod';
import { boonClientiSchema } from './boon.clienti';

export const boonTenantsSchema = z.object({
  id: z.number().finite(),
  idCliente: boonClientiSchema.shape.id,
  slug: z.string().nonempty(),
  logo: z.string().nullable(),
});
export type BoonTenants = z.infer<typeof boonTenantsSchema>;
