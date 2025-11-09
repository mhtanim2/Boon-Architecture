import { BoonTemplateClientiEntity } from '@boon/backend/database/entities/boon';
import { FindOptionsRelations } from 'typeorm';

export const templateOneDefaultRelations: FindOptionsRelations<BoonTemplateClientiEntity> = {
  cliente: { tenant: true, luogo: true },
  stato: true,
  funzionalita: true,
  composizione: true,
};

export const templateManyDefaultRelations: FindOptionsRelations<BoonTemplateClientiEntity> = {
  cliente: { tenant: true, luogo: true  },
  stato: true,
  funzionalita: true,
  composizione: true,
};
