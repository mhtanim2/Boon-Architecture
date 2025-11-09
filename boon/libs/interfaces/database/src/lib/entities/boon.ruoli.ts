import { z } from 'zod';

export const boonRuoliSchema = z.object({
  id: z.number().finite(),
  nome: z.string().nonempty(),
  descrizione: z.string().nonempty(),
  flagInterno: z.boolean(),
});
export type BoonRuoli = z.infer<typeof boonRuoliSchema>;
