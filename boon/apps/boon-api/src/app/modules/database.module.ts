import {
  BOON_DATASOURCE,
  DatabaseConfig,
  typeormModuleOptionsFactory,
  typeormTransactionalDataSourceFactory,
} from '@boon/backend/database';
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { databaseConfig } from './database.config';

const dataSources: DataSource[] = [];

const typeormModules = [
  TypeOrmModule.forRootAsync({
    name: BOON_DATASOURCE,
    dataSourceFactory: typeormTransactionalDataSourceFactory(dataSources, BOON_DATASOURCE),
    useFactory: async (dbConfig: DatabaseConfig) => await typeormModuleOptionsFactory(dbConfig, BOON_DATASOURCE),
    inject: [databaseConfig.KEY],
  }),
];

@Global()
@Module({
  imports: [...typeormModules],
  providers: [],
  exports: [...typeormModules],
})
export class DatabaseModule {}
