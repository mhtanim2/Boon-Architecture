import { z } from 'zod';

export const boonLuoghiSchema = z.object({
  codice: z.string().nonempty(),
  comune: z.string().nonempty(),
  siglaProvincia: z.string().nonempty(),
  provincia: z.string().nonempty(),
  codiceRegione: z.string().nonempty(),
  regione: z.string().nonempty(),
  codiceStato: z.string().nonempty(),
  stato: z.string().nonempty(),
  flagAttivo: z.boolean(),
});
export type BoonLuoghi = z.infer<typeof boonLuoghiSchema>;
