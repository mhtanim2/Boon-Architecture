import { z } from 'zod';

export const boonLivelliPrivilegiSchema = z.object({
  id: z.number().finite(),
  nome: z.string().nonempty(),
  descrizione: z.string().nonempty(),
});
export type BoonLivelliPrivilegi = z.infer<typeof boonLivelliPrivilegiSchema>;
