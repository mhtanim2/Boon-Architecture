import { DataSource, DataSourceOptions } from 'typeorm';

export const typeormDataSourceFactory = (dataSources: DataSource[]) => async (options?: DataSourceOptions) => {
  const dataSource = await new DataSource(options!).initialize();
  dataSources.push(dataSource);
  return dataSource;
};

export const typeormTransactionalDataSourceFactory =
  (dataSources: DataSource[], name?: string) => async (options?: DataSourceOptions) => {
    const tt = await import('typeorm-transactional');
    const dataSource = tt.addTransactionalDataSource({ name: name, dataSource: new DataSource(options!) });
    dataSources.push(dataSource);
    return dataSource;
  };
