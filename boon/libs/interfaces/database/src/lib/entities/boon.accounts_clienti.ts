import { z } from 'zod';
import { boonAccountsSchema } from './boon.accounts';
import { boonClientiSchema } from './boon.clienti';

export const boonAccountsClientiSchema = z.object({
  id: z.number().finite(),
  idAccount: boonAccountsSchema.shape.id,
  idCliente: boonClientiSchema.shape.id,
});
export type BoonAccountsClienti = z.infer<typeof boonAccountsClientiSchema>;
