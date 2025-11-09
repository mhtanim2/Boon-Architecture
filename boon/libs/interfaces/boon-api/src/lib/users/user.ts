import {
  boonAccountsFunzionalitaSchema,
  boonAccountsSchema,
  boonClientiSchema,
  boonFunzionalitaSchema,
  boonGetPrivilegesRowSchema,
  boonLivelliPrivilegiSchema,
  boonRuoliSchema,
  boonStatiAccountsSchema,
  boonTenantsSchema,
} from '@boon/interfaces/database';
import { z } from 'zod';

export const userSchema = boonAccountsSchema
  .omit({
    idCliente: true,
    idStato: true,
  })
  .extend({
    cliente: boonClientiSchema
      .pick({ id: true, ragioneSociale: true })
      .extend({ tenant: boonTenantsSchema.omit({ idCliente: true }).optional() }),
    stato: boonStatiAccountsSchema.pick({ id: true, nome: true, descrizione: true, flagAbilitato: true }),
    ruoli: z.array(
      z.object({
        id: boonRuoliSchema.shape.id,
        nome: boonRuoliSchema.shape.nome,
      })
    ),
    clienti: z.array(
      boonClientiSchema.pick({ id: true, ragioneSociale: true }).extend({
        tenant: boonTenantsSchema.omit({ idCliente: true }),
        privilegi: z.array(boonGetPrivilegesRowSchema),
      })
    ),
  });
export type User = z.infer<typeof userSchema>;

export const userResSchema = userSchema.omit({
  password: true,
  ultimoHashRefreshToken: true,
});
export type UserRes = z.infer<typeof userResSchema>;
export const userResExcerptSchema = userResSchema.omit({ clienti: true });
export type UserResExcerpt = z.infer<typeof userResExcerptSchema>;

export const createUserSchema = boonAccountsSchema
  .pick({
    username: true,
    cognome: true,
    nome: true,
    flagEmailVerificata: true,
    flagPasswordDaCambiare: true,
  })
  .extend({
    cliente: z.object({
      id: boonClientiSchema.shape.id,
      ragioneSociale: boonClientiSchema.shape.ragioneSociale.optional(),
    }),
    stato: z.object({
      id: boonStatiAccountsSchema.shape.id,
      nome: boonStatiAccountsSchema.shape.nome.optional(),
    }),
    ruoli: z.array(
      z.object({
        id: boonRuoliSchema.shape.id,
        nome: boonRuoliSchema.shape.nome.optional(),
      })
    ),
    clienti: z.array(
      z.object({
        id: boonClientiSchema.shape.id,
        ragioneSociale: boonClientiSchema.shape.ragioneSociale.optional(),
        privilegi: z.array(
          z.object({
            idFunzionalita: boonFunzionalitaSchema.shape.id,
            idLivello: boonLivelliPrivilegiSchema.shape.id,
            funzionalita: boonFunzionalitaSchema.shape.descrizione.optional(),
            livello: boonLivelliPrivilegiSchema.shape.nome.optional(),
            flagAbilitata: boonAccountsFunzionalitaSchema.shape.flagAbilitata,
          })
        ),
      })
    ),
  });
export type CreateUser = z.infer<typeof createUserSchema>;

export const updateUserSchema = createUserSchema
  .pick({
    cognome: true,
    nome: true,
    username: true,
    flagPasswordDaCambiare: true,
    flagEmailVerificata: true,
    stato: true,
    ruoli: true,
    clienti: true,
  })
  .partial();
export type UpdateUser = z.infer<typeof updateUserSchema>;
