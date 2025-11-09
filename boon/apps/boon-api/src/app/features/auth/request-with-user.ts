import { Tenant, User } from '@boon/interfaces/boon-api';
import { Request } from 'express';

export interface RequestWithUserTenant extends Request {
  user: User;
  tenant: Tenant | null;
}
