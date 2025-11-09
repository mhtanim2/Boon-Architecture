import { z } from 'zod';
import { boonLuoghiSchema } from './boon.luoghi';

export const boonClientiSchema = z.object({
  id: z.number().finite(),
  ragioneSociale: z.string().nonempty(),
  partitaIva: z.string().nonempty().nullable(),
  codiceFiscale: z.string().nonempty().nullable(),
  codiceSdi: z.string().nonempty().nullable(),
  pec: z.string().nonempty().nullable(),
  indirizzo: z.string().nonempty().nullable(),
  cap: z.string().nonempty().nullable(),
  codiceLuogo: boonLuoghiSchema.shape.codice.nullable(),
  telefono: z.string().nonempty().nullable(),
  eMail: z.string().nonempty().nullable(),
  web: z.string().nonempty().nullable(),
  flagInterno: z.boolean(),
});
export type BoonClienti = z.infer<typeof boonClientiSchema>;
