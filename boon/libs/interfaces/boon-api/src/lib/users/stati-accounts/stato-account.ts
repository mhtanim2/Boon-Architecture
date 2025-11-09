import { boonStatiAccountsSchema } from '@boon/interfaces/database';
import { z } from 'zod';

export const statoAccountSchema = boonStatiAccountsSchema;
export type StatoAccount = z.infer<typeof statoAccountSchema>;

export const statoAccountResSchema = statoAccountSchema;
export type StatoAccountRes = z.infer<typeof statoAccountResSchema>;
export const statoAccountResExcerptSchema = statoAccountSchema;
export type StatoAccountResExcerpt = z.infer<typeof statoAccountResExcerptSchema>;

export const createStatoAccountSchema = boonStatiAccountsSchema.pick({
  nome: true,
  descrizione: true,
  flagAbilitato: true,
});
export type CreateStatoAccount = z.infer<typeof createStatoAccountSchema>;

export const updateStatoAccountSchema = createStatoAccountSchema
  .pick({
    descrizione: true,
  })
  .partial();
export type UpdateStatoAccount = z.infer<typeof updateStatoAccountSchema>;
