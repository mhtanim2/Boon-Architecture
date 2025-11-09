import { z } from 'zod';

export const boonStatiAccountsSchema = z.object({
  id: z.number().finite(),
  nome: z.string().nonempty(),
  descrizione: z.string().nonempty(),
  flagAbilitato: z.boolean(),
});
export type BoonStatiAccounts = z.infer<typeof boonStatiAccountsSchema>;
