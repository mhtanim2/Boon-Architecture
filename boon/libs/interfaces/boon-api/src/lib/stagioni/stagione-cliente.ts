import { boonStagioniClientiSchema, boonStagioniSchema } from '@boon/interfaces/database';
import { z } from 'zod';
import { stagioneResSchema } from './stagione';

export const stagioneClienteSchema = boonStagioniClientiSchema;
export type StagioneCliente = z.infer<typeof stagioneClienteSchema>;

export const stagioneClienteResSchema = stagioneClienteSchema
  .omit({
    idCliente: true,
    idStagione: true,
  })
  .extend({ stagione: stagioneResSchema });
export type StagioneClienteRes = z.infer<typeof stagioneClienteResSchema>;
export const stagioneClienteResExcerptSchema = stagioneClienteSchema;
export type StagioneClienteResExcerpt = z.infer<typeof stagioneClienteResExcerptSchema>;

export const createStagioneClienteSchema = stagioneClienteSchema
  .pick({
    codice: true,
    nome: true,
  })
  .extend({
    stagione: z.object({
      id: boonStagioniSchema.shape.id,
      codice: boonStagioniSchema.shape.codice.optional(),
    }),
  });
export type CreateStagioneCliente = z.infer<typeof createStagioneClienteSchema>;

export const updateStagioneClienteSchema = createStagioneClienteSchema.partial();
export type UpdateStagioneCliente = z.infer<typeof updateStagioneClienteSchema>;
