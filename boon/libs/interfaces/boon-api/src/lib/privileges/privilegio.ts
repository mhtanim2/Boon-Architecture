import {
  boonAccountsFunzionalitaSchema,
  boonFunzionalitaSchema,
  boonLivelliPrivilegiSchema,
} from '@boon/interfaces/database';
import { z } from 'zod';

export const privilegioSchema = z.object({
  idFunzionalita: boonFunzionalitaSchema.shape.id,
  idLivello: boonLivelliPrivilegiSchema.shape.id,
  flagAbilitata: boonAccountsFunzionalitaSchema.shape.flagAbilitata,
  funzionalita: boonFunzionalitaSchema.shape.descrizione,
  livello: boonLivelliPrivilegiSchema.shape.nome,
});
export type Privilegio = z.infer<typeof privilegioSchema>;

export const privilegioResSchema = privilegioSchema;
export type PrivilegioRes = z.infer<typeof privilegioResSchema>;
export const privilegioResExcerptSchema = privilegioResSchema;
export type PrivilegioResExcerpt = z.infer<typeof privilegioResExcerptSchema>;
