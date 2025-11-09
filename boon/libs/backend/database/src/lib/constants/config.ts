import { z } from 'zod';

export const databaseSchema = z.object({
  connectionString: z.string(),
  type: z.enum([
    'mysql',
    'postgres',
    'cockroachdb',
    'sap',
    'mariadb',
    'sqlite',
    'cordova',
    'react-native',
    'nativescript',
    'sqljs',
    'oracle',
    'mssql',
    'mongodb',
    'aurora-mysql',
    'aurora-postgres',
    'expo',
    'better-sqlite3',
    'capacitor',
    'spanner',
  ]),
  host: z.string(),
  port: z.number(),
  username: z.string(),
  password: z.string(),
  database: z.string(),
});

export type DatabaseConfig = z.TypeOf<typeof databaseSchema>;
