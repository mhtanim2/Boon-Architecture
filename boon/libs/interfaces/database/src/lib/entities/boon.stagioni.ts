import { z } from 'zod';

export const boonStagioniSchema = z.object({
  id: z.number().finite(),
  codice: z.number().finite(),
  nome: z.string().max(255),
});
export type BoonStagioni = z.infer<typeof boonStagioniSchema>;
