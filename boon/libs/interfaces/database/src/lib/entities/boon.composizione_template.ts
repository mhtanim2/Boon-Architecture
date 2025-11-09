import { z } from 'zod';
import { boonTemplateClientiSchema } from './boon.template_clienti';

export const boonComposizioneTemplateSchema = z.object({
  id: z.number().finite(),
  idTemplate: boonTemplateClientiSchema.shape.id,
  nomeColonna: z.string().max(255),
  tipoDati: z.string().max(80),
  lunghezzaMassima: z.number().finite().nullable(),
  flagRichiesto: z.boolean(),
  regola: z.string().max(80).nullable(),
  posizione: z.number().finite(),
  dataMatch: z.string().max(80).nullable(),
});
export type BoonComposizioneTemplate = z.infer<typeof boonComposizioneTemplateSchema>;
