import { DatabaseConfig, databaseSchema } from '@boon/backend/database';
import { coerceRecordTypes } from '@boon/common/core';
import { registerAs } from '@nestjs/config';
import { ConnectionString } from 'connection-string';
import { first } from 'lodash';
import { z } from 'zod';

const rawDatabaseSchema = z.object({
  database: z.string(),
});

export const databaseConfig = registerAs('database', () => {
  const env = coerceRecordTypes(process.env);
  const envParsed = rawDatabaseSchema.strict().parse({
    database: env['DATABASE_BOON'],
  });

  const connectionString = new ConnectionString(envParsed.database);

  const config: DatabaseConfig = databaseSchema.strict().parse({
    connectionString: connectionString.toString(),
    type: connectionString.protocol,
    host: first(connectionString.hosts)?.name,
    port: first(connectionString.hosts)?.port,
    username: connectionString.user,
    password: connectionString.password,
    database: first(connectionString.path),
  });
  return config;
});
