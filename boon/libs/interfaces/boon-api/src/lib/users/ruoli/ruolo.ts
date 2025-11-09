import { boonRuoliSchema } from '@boon/interfaces/database';
import { z } from 'zod';

export const ruoloSchema = boonRuoliSchema;
export type Ruolo = z.infer<typeof ruoloSchema>;

export const ruoloResSchema = ruoloSchema;
export type RuoloRes = z.infer<typeof ruoloResSchema>;
export const ruoloResExcerptSchema = ruoloResSchema;
export type RuoloResExcerpt = z.infer<typeof ruoloResExcerptSchema>;
