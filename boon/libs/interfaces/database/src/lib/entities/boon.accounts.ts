import { zc } from '@boon/common/zod';
import { z } from 'zod';
import { boonClientiSchema } from './boon.clienti';
import { boonStatiAccountsSchema } from './boon.stati_accounts';

export const boonAccountsSchema = z.object({
  id: z.number().finite(),
  idStato: boonStatiAccountsSchema.shape.id,
  idCliente: boonClientiSchema.shape.id,
  username: z.string().nonempty().email(),
  password: z.string().nullable(),
  dataCreazione: zc.stringDateOnly(),
  dataScadenza: zc.stringDateOnly().nullable(),
  flagPrimoAccesso: z.boolean(),
  cognome: z.string().nonempty(),
  nome: z.string().nonempty(),
  ultimoHashRefreshToken: z.string().nullable(),
  flagEmailVerificata: z.boolean(),
  flagPasswordDaCambiare: z.boolean(),
});
export type BoonAccounts = z.infer<typeof boonAccountsSchema>;
