import { boonStatiTemplateSchema } from '@boon/interfaces/database';
import { z } from 'zod';

export const statoTemplateSchema = boonStatiTemplateSchema;
export type StatoTemplate = z.infer<typeof statoTemplateSchema>;

export const statoTemplateResSchema = statoTemplateSchema;
export type StatoTemplateRes = z.infer<typeof statoTemplateResSchema>;
export const statoTemplateResExcerptSchema = statoTemplateSchema;
export type StatoTemplateResExcerpt = z.infer<typeof statoTemplateResExcerptSchema>;

export const createStatoTemplateSchema = boonStatiTemplateSchema.pick({
  nome: true,
  descrizione: true,
  flagAbilitato: true,
});
export type CreateStatoTemplate = z.infer<typeof createStatoTemplateSchema>;

export const updateStatoTemplateSchema = createStatoTemplateSchema
  .pick({
    descrizione: true,
  })
  .partial();
export type UpdateStatoTemplate = z.infer<typeof updateStatoTemplateSchema>;
