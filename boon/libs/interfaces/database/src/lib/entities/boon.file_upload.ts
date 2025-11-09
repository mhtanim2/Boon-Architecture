import { z } from 'zod';
import { boonAccountsSchema } from './boon.accounts';
import { boonTemplateClientiSchema } from './boon.template_clienti';

export const boonFileUploadSchema = z.object({
  id: z.number().finite(),
  idTemplate: boonTemplateClientiSchema.shape.id,
  idUploader: boonAccountsSchema.shape.id,
  dataOra: z.coerce.date(),
  ultimaModifica: z.coerce.date(),
  nomeFile: z.string().nonempty(),
  url: z.string().nonempty(),
  dimensione: z.number().finite().nonnegative(),
});
export type BoonFileUpload = z.infer<typeof boonFileUploadSchema>;
