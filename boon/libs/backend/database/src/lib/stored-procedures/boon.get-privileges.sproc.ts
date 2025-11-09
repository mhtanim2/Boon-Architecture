import { boonGetPrivilegesRowSchema } from '@boon/interfaces/database';
import { createTypesafeSqlProc } from '../utils';

export class BoonGetPrivilegesSproc extends createTypesafeSqlProc('GetPrivileges', boonGetPrivilegesRowSchema, {
  accountId: { order: 0 },
  clienteId: { order: 1, isOptional: true },
}) {}
