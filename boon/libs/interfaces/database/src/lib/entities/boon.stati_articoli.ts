import { z } from 'zod';

export const boonStatiArticoliSchema = z.object({
  id: z.number().finite(),
  nome: z.string().nonempty(),
  descrizione: z.string().nonempty(),
});
export type BoonStatiArticoli = z.infer<typeof boonStatiArticoliSchema>;
