import { z } from 'zod';
import { ruoloResExcerptSchema, ruoloResSchema, ruoloSchema } from '../users';
import { privilegioResExcerptSchema, privilegioResSchema, privilegioSchema } from './privilegio';

export const privilegiByRuoloSchema = z.object({
  ruolo: ruoloSchema,
  privilegi: z.array(privilegioSchema),
});
export type PrivilegiByRuolo = z.infer<typeof privilegiByRuoloSchema>;

export const privilegiByRuoloResSchema = z.object({
  ruolo: ruoloResSchema,
  privilegi: z.array(privilegioResSchema),
});
export type PrivilegiByRuoloRes = z.infer<typeof privilegiByRuoloResSchema>;
export const privilegiByRuoloResExcerptSchema = z.object({
  ruolo: ruoloResExcerptSchema,
  privilegi: z.array(privilegioResExcerptSchema),
});
export type PrivilegiByRuoloResExcerpt = z.infer<typeof privilegiByRuoloResExcerptSchema>;
