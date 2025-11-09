import { boonLivelliPrivilegiSchema } from '@boon/interfaces/database';
import { z } from 'zod';

export const livelloPivilegioSchema = boonLivelliPrivilegiSchema;
export type LivelloPrivilegio = z.infer<typeof livelloPivilegioSchema>;

export const livelloPrivilegioResSchema = livelloPivilegioSchema;
export type LivelloPrivilegioRes = z.infer<typeof livelloPrivilegioResSchema>;
export const livelloPrivilegioResExcerptSchema = livelloPrivilegioResSchema;
export type LivelloPrivilegioResExcerpt = z.infer<typeof livelloPrivilegioResExcerptSchema>;

export const createLivelloPrivilegioSchema = boonLivelliPrivilegiSchema.pick({
  id: true,
  nome: true,
  descrizione: true,
});
export type CreateLivelloPrivilegio = z.infer<typeof createLivelloPrivilegioSchema>;

export const updateLivelloPrivilegioSchema = createLivelloPrivilegioSchema
  .pick({
    descrizione: true,
  })
  .partial();
export type UpdateLivelloPrivilegio = z.infer<typeof updateLivelloPrivilegioSchema>;
