import { BoonClientiEntity } from '@boon/backend/database/entities/boon';
import { FindOptionsRelations } from 'typeorm';

export const clientiOneDefaultRelations: FindOptionsRelations<BoonClientiEntity> = {
  tenant: true,
  luogo: true,
};

export const clientiManyDefaultRelations: FindOptionsRelations<BoonClientiEntity> = {
  tenant: true,
  luogo: true,
};
