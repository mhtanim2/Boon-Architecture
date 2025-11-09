import { boonGeneriAliasSchema, boonGeneriSchema } from '@boon/interfaces/database';
import { z } from 'zod';

export const genereSchema = boonGeneriSchema;
export type Genere = z.infer<typeof genereSchema>;

export const genereResSchema = genereSchema.extend({
  alias: z.array(boonGeneriAliasSchema).transform((alias) => alias.map(x => x.alias)),
});
export type GenereRes = z.infer<typeof genereResSchema>;
export const genereResExcerptSchema = genereResSchema;
export type GenereResExcerpt = z.infer<typeof genereResExcerptSchema>;

export const createGenereSchema = boonGeneriSchema.pick({
  nome: true,
  sigla: true,
}).extend({
  alias: z.array(boonGeneriAliasSchema.shape.alias),
});
export type CreateGenere = z.infer<typeof createGenereSchema>;

export const updateGenereSchema = createGenereSchema.partial();
export type UpdateGenere = z.infer<typeof updateGenereSchema>;
