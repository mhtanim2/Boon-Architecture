import { boonStatiRevisioniSchema } from '@boon/interfaces/database';
import { z } from 'zod';

export const statoRevisioneSchema = boonStatiRevisioniSchema;
export type StatoRevisione = z.infer<typeof statoRevisioneSchema>;

export const statoRevisioneResSchema = statoRevisioneSchema;
export type StatoRevisioneRes = z.infer<typeof statoRevisioneResSchema>;
export const statoRevisioneResExcerptSchema = statoRevisioneSchema;
export type StatoRevisioneResExcerpt = z.infer<typeof statoRevisioneResExcerptSchema>;

export const createStatoRevisioneSchema = boonStatiRevisioniSchema.pick({
  nome: true,
  descrizione: true,
});
export type CreateStatoRevisione = z.infer<typeof createStatoRevisioneSchema>;

export const updateStatoRevisioneSchema = createStatoRevisioneSchema
  .pick({
    descrizione: true,
  })
  .partial();
export type UpdateStatoRevisione = z.infer<typeof updateStatoRevisioneSchema>;
