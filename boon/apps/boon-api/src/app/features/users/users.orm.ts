import { BoonAccountsEntity } from '@boon/backend/database/entities/boon';
import { FindOptionsRelations } from 'typeorm';

export const accountsOneDefaultRelations: FindOptionsRelations<BoonAccountsEntity> = {
  cliente: { tenant: true },
  accountsClienti: { cliente: { tenant: true } },
  accountsFunzionalita: { cliente: true, funzionalita: true },
  stato: true,
  profili: { ruolo: true },
};

export const accountsManyDefaultRelations: FindOptionsRelations<BoonAccountsEntity> = {
  cliente: { tenant: true },
  stato: true,
  profili: { ruolo: true },
};
