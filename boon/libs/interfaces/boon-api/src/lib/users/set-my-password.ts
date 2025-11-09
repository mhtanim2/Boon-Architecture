import { boonAccountsSchema } from '@boon/interfaces/database';
import { z } from 'zod';

export const setMyPasswordSchema = z.object({
  password: boonAccountsSchema.shape.password.unwrap(),
});
export type SetMyPassword = z.infer<typeof setMyPasswordSchema>;
