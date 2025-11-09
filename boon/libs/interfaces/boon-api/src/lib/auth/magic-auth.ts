import { extendApi as s } from '@anatine/zod-openapi';
import { boonAccountsSchema } from '@boon/interfaces/database';
import { z } from 'zod';

export const MagicLinkActionEnum = z.enum(['WELCOME', 'RESET_PASSWORD', 'VERIFY_EMAIL']);
export type MAGIC_LINK_ACTION = z.infer<typeof MagicLinkActionEnum>;

export const loginWithMagicLinkQuerySchema = z
  .object({
    action: s(MagicLinkActionEnum),
  })
  .partial();
export type LoginWithMagicLinkQuery = z.infer<typeof loginWithMagicLinkQuerySchema>;
export const loginWithMagicLinkBodySchema = z.object({
  destination: s(boonAccountsSchema.shape.username),
});
export type LoginWithMagicLinkBody = z.infer<typeof loginWithMagicLinkBodySchema>;
export const loginWithMagicLinkResBodySchema = z.object({
  success: s(z.literal(true)),
  code: s(z.number().finite().positive()),
});
export type LoginWithMagicLinkResBody = z.infer<typeof loginWithMagicLinkResBodySchema>;

export const loginWithMagicLinkCallbackQuerySchema = loginWithMagicLinkQuerySchema.extend({
  token: s(z.string().nonempty()),
});
export type LoginWithMagicLinkCallbackQuery = z.infer<typeof loginWithMagicLinkCallbackQuerySchema>;
