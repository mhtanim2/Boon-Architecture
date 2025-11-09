import { z } from 'zod';
import { boonGeneriSchema } from './boon.generi';

export const boonGeneriAliasSchema = z.object({
  id: z.number().finite(),
  idGenere: boonGeneriSchema.shape.id,
  alias: z.string().max(255),
});
export type BoonGeneriAlias = z.infer<typeof boonGeneriAliasSchema>;
