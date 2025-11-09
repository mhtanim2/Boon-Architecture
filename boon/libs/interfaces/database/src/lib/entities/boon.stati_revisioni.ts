import { z } from 'zod';

export const boonStatiRevisioniSchema = z.object({
  id: z.number().finite(),
  nome: z.string().nonempty(),
  descrizione: z.string().nonempty(),
});
export type BoonStatiRevisioni = z.infer<typeof boonStatiRevisioniSchema>;
