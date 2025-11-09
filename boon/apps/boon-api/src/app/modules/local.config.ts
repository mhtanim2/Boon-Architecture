import { coerceRecordTypes } from '@boon/common/core';
import { registerAs } from '@nestjs/config';
import { z } from 'zod';

export const localSchema = z.object({
  production: z.boolean(),
  port: z.number().optional(),
  browserUrl: z.string().url(),
  jwtAccessTokenSecret: z.string(),
  jwtAccessTokenExpirationTimeInSeconds: z.number().finite().nonnegative(),
  jwtRefreshTokenSecret: z.string(),
  jwtRefreshTokenExpirationTimeInSeconds: z.number().finite().nonnegative(),
  magicLinkTokenSecret: z.string(),
  magicLinkTokenExpirationTimeInSeconds: z.number().finite().nonnegative(),
  fileUploadTempDirectory: z.string(),
  fileUploadDestDirectory: z.string(),
  seqServerHost: z.string(),
  seqServerPort: z.number().finite().positive(),
  seqApiKey: z.string(),
});
export type LocalConfig = z.infer<typeof localSchema>;

export const localConfig = registerAs('local', () => {
  const env = coerceRecordTypes(process.env);

  const config: LocalConfig = localSchema.strict().parse({
    production: env['PRODUCTION'],
    port: env['PORT'],
    browserUrl: env['BROWSER_URL'],
    jwtAccessTokenSecret: env['JWT_ACCESS_TOKEN_SECRET'],
    jwtAccessTokenExpirationTimeInSeconds: env['JWT_ACCESS_TOKEN_EXPIRATION_TIME_IN_SECONDS'],
    jwtRefreshTokenSecret: env['JWT_REFRESH_TOKEN_SECRET'],
    jwtRefreshTokenExpirationTimeInSeconds: env['JWT_REFRESH_TOKEN_EXPIRATION_TIME_IN_SECONDS'],
    magicLinkTokenSecret: env['MAGIC_LINK_TOKEN_SECRET'],
    magicLinkTokenExpirationTimeInSeconds: env['MAGIC_LINK_TOKEN_EXPIRATION_TIME_IN_SECONDS'],
    fileUploadTempDirectory: env['FILE_UPLOAD_TEMP_DIRECTORY'],
    fileUploadDestDirectory: env['FILE_UPLOAD_DEST_DIRECTORY'],
    seqServerHost: env['SEQ_SERVER_HOST'],
    seqServerPort: env['SEQ_SERVER_PORT'],
    seqApiKey: env['SEQ_API_KEY'],
  });
  return config;
});
