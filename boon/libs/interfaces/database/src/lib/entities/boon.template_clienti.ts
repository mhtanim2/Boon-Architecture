import { z } from 'zod';
import { boonClientiSchema } from './boon.clienti';
import { boonStatiTemplateSchema } from './boon.stati_template';
import { boonFunzionalitaSchema } from './boon.funzionalita';

export const boonTemplateClientiSchema = z.object({
  id: z.number().finite(),
  idCliente: boonClientiSchema.shape.id,
  idFunzionalita: boonFunzionalitaSchema.shape.id,
  idStato: boonStatiTemplateSchema.shape.id,
  nome: z.string(),
});
export type BoonTemplateClienti = z.infer<typeof boonTemplateClientiSchema>;
