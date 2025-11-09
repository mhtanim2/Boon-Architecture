import { boonFunzionalitaSchema } from '@boon/interfaces/database';
import { z } from 'zod';

export const funzionalitaSchema = boonFunzionalitaSchema;
export type Funzionalita = z.infer<typeof funzionalitaSchema>;

export const funzionalitaResSchema = funzionalitaSchema.omit({ flagSpecifica: true });
export type FunzionalitaRes = z.infer<typeof funzionalitaResSchema>;
export const funzionalitaResExcerptSchema = funzionalitaResSchema;
export type FunzionalitaResExcerpt = z.infer<typeof funzionalitaResExcerptSchema>;
