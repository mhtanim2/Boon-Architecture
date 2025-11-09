import { z } from 'zod';

export const boonStatiTemplateSchema = z.object({
  id: z.number().finite(),
  nome: z.string().nonempty(),
  descrizione: z.string().nonempty(),
  flagAbilitato: z.boolean(),
});
export type BoonStatiTemplate = z.infer<typeof boonStatiTemplateSchema>;
