import { BoonFileUploadEntity } from '@boon/backend/database/entities/boon';
import { Tenant } from '@boon/interfaces/boon-api';
import { FindOptionsRelations, FindOptionsWhere, SelectQueryBuilder } from 'typeorm';

export const fileUploadDefaultWhere: (tenant: Tenant) => FindOptionsWhere<BoonFileUploadEntity> = (tenant: Tenant) => ({
  template: {
    idCliente: tenant.cliente.id,
  },
});

export const fileUploadDefaultQbWhere: (
  alias: string,
  tenant: Tenant
) => Parameters<SelectQueryBuilder<BoonFileUploadEntity>['andWhere']> = (alias: string, tenant: Tenant) => [
  `${alias}.idCliente = :idCliente`,
  { idCliente: tenant.cliente.id },
];

export const fileUploadOneDefaultRelations: FindOptionsRelations<BoonFileUploadEntity> = {
  template: { funzionalita: true },
  uploader: true,
};

export const fileUploadManyDefaultRelations: FindOptionsRelations<BoonFileUploadEntity> = {
  template: { funzionalita: true },
  uploader: true,
};
