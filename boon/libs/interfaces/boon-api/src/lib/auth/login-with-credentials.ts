import { boonAccountsSchema } from '@boon/interfaces/database';
import { z } from 'zod';

export const loginWithCredentialsBodySchema = z.object({
  username: boonAccountsSchema.shape.username,
  password: z.string().nonempty(),
});
export type LoginWithCredentialsBody = z.infer<typeof loginWithCredentialsBodySchema>;
