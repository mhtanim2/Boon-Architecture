import { boonStagioniSchema } from '@boon/interfaces/database';
import { z } from 'zod';

export const stagioneSchema = boonStagioniSchema;
export type Stagione = z.infer<typeof stagioneSchema>;

export const stagioneResSchema = stagioneSchema;
export type StagioneRes = z.infer<typeof stagioneResSchema>;
export const stagioneResExcerptSchema = stagioneSchema;
export type StagioneResExcerpt = z.infer<typeof stagioneResExcerptSchema>;

export const createStagioneSchema = boonStagioniSchema.pick({
  codice: true,
  nome: true,
});
export type CreateStagione = z.infer<typeof createStagioneSchema>;

export const updateStagioneSchema = createStagioneSchema.partial();
export type UpdateStagione = z.infer<typeof updateStagioneSchema>;
