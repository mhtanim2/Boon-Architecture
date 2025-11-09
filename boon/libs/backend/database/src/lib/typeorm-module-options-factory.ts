import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DatabaseConfig } from './constants';

export const typeormModuleOptionsFactory = async (
  databaseConfig: DatabaseConfig,
  schemaName: string
): Promise<TypeOrmModuleOptions> => {
  const _entities = await import(`./entities`);
  const entities = (Object.keys(_entities) as Array<keyof typeof _entities>).map(
    (entity: keyof typeof _entities) => _entities[entity]
  );
  return {
    name: schemaName,
    type: databaseConfig.type as any,
    host: databaseConfig.host,
    port: databaseConfig.port,
    username: databaseConfig.username,
    password: databaseConfig.password,
    database: databaseConfig.database,
    entities: [...entities],
    synchronize: false,
    logging: process.env['NODE_ENV'] !== 'production',
    keepConnectionAlive: true,
    schema: schemaName,
  };
};
