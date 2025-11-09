import { z } from 'zod';

export const boonGeneriSchema = z.object({
  id: z.number().finite(),
  nome: z.string().max(255),
  sigla: z.string().max(255),
});
export type BoonGeneri = z.infer<typeof boonGeneriSchema>;
