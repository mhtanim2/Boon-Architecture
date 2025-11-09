import { z } from 'zod';

export const boonFunzionalitaSchema = z.object({
  id: z.number().finite(),
  nome: z.string().nonempty(),
  descrizione: z.string().nonempty(),
  flagSpecifica: z.boolean(),
});
export type BoonFunzionalita = z.infer<typeof boonFunzionalitaSchema>;
