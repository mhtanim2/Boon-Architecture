import { boonClientiSchema, boonLuoghiSchema, boonTenantsSchema } from '@boon/interfaces/database';
import { z } from 'zod';

export const luogoResSchema = boonLuoghiSchema;

export const clienteSchema = boonClientiSchema;
export type Cliente = z.infer<typeof clienteSchema>;

export const clienteResSchema = clienteSchema
  .omit({
    codiceLuogo: true,
  })
  .extend({
    luogo: luogoResSchema.nullable(),
    tenant: z.object({
      slug: boonTenantsSchema.shape.slug,
      logo: boonTenantsSchema.shape.logo,
    }),
  });
export type ClienteRes = z.infer<typeof clienteResSchema>;

export const clienteResExcerptSchema = clienteResSchema
  .omit({
    luogo: true,
  })
  .extend({
    luogo: z
      .object({
        codice: boonLuoghiSchema.shape.codice,
        comune: boonLuoghiSchema.shape.comune.optional(),
      })
      .nullable(),
  });
export type ClienteResExcerpt = z.infer<typeof clienteResSchema>;

export const createClienteSchema = boonClientiSchema
  .omit({
    id: true,
    codiceLuogo: true,
  })
  .extend({
    luogo: z
      .object({
        codice: boonLuoghiSchema.shape.codice,
        comune: boonLuoghiSchema.shape.comune.optional(),
      })
      .nullish(),
    tenant: z.object({
      slug: boonTenantsSchema.shape.slug,
      logo: boonTenantsSchema.shape.logo,
    }),
  });
export type CreateCliente = z.infer<typeof createClienteSchema>;

export const updateClienteSchema = createClienteSchema.partial();
export type UpdateCliente = z.infer<typeof updateClienteSchema>;
