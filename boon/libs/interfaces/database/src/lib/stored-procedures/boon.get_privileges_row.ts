import { camelize } from '@boon/common/core';
import { z } from 'zod';

export const boonGetPrivilegesRowSchema = z.object(
  camelize({
    id_account: z.number(),
    id_cliente: z.number(),
    cliente: z.string().nonempty(),
    id_funzionalita: z.number(),
    codice_funzionalita: z.string().nonempty(),
    funzionalita: z.string().nonempty(),
    id_livello: z.coerce.number(),
    livello: z.string().nonempty(),
  })
);
export type BoonGetPrivilegesRow = z.infer<typeof boonGetPrivilegesRowSchema>;
