import { boonStatiArticoliSchema } from '@boon/interfaces/database';
import { z } from 'zod';

export const statoArticoloSchema = boonStatiArticoliSchema;
export type StatoArticolo = z.infer<typeof statoArticoloSchema>;

export const statoArticoloResSchema = statoArticoloSchema;
export type StatoArticoloRes = z.infer<typeof statoArticoloResSchema>;
export const statoArticoloResExcerptSchema = statoArticoloSchema;
export type StatoArticoloResExcerpt = z.infer<typeof statoArticoloResExcerptSchema>;

export const createStatoArticoloSchema = boonStatiArticoliSchema.pick({
  nome: true,
  descrizione: true,
});
export type CreateStatoArticolo = z.infer<typeof createStatoArticoloSchema>;

export const updateStatoArticoloSchema = createStatoArticoloSchema
  .pick({
    descrizione: true,
  })
  .partial();
export type UpdateStatoArticolo = z.infer<typeof updateStatoArticoloSchema>;
