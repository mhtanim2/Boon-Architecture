import { z } from 'zod';

export const mailerSchema = z.object({
  smtp: z.object({
    server: z.string(),
    username: z.string().nullable(),
    password: z.string().nullable(),
    port: z.number(),
    flagSsl: z.boolean(),
  }),
  defaultOptions: z
    .object({
      mailFrom: z.string().optional(),
    })
    .optional(),
  context: z.any(),
});
export type MailerConfig = z.TypeOf<typeof mailerSchema>;
