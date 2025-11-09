import { z } from 'zod';
import { boonStagioniSchema } from './boon.stagioni';
import { boonClientiSchema } from './boon.clienti';

export const boonStagioniClientiSchema = z.object({
  id: z.number().finite(),
  idStagione: boonStagioniSchema.shape.id,
  idCliente: boonClientiSchema.shape.id,
  codice: z.string().max(80),
  nome: z.string().max(255),
});
export type BoonStagioniClienti = z.infer<typeof boonStagioniClientiSchema>;
