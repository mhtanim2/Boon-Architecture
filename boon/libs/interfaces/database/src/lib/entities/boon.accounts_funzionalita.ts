import { z } from 'zod';
import { boonAccountsSchema } from './boon.accounts';
import { boonClientiSchema } from './boon.clienti';
import { boonFunzionalitaSchema } from './boon.funzionalita';

export const boonAccountsFunzionalitaSchema = z.object({
  id: z.number().finite(),
  idAccount: boonAccountsSchema.shape.id,
  idFunzionalita: boonFunzionalitaSchema.shape.id,
  idCliente: boonClientiSchema.shape.id,
  flagAbilitata: z.boolean(),
});
export type BoonAccountsFunzionalita = z.infer<typeof boonAccountsFunzionalitaSchema>;
