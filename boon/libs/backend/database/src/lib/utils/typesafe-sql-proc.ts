import { camelize } from '@boon/common/core';
import { isArray, isNil } from 'lodash';
import { EntityManager } from 'typeorm';
import { NonFunctionKeys } from 'utility-types';
import { ZodSchema, z } from 'zod';

const typesafeSqlProc = async <T extends readonly unknown[] | Record<string, unknown>>(
  entityManager: EntityManager,
  sp: string,
  params: unknown[],
  zodSchema?: ZodSchema
) => {
  const sql = `CALL ${sp}(${params.map((x) => (!isNil(x) ? x : 'NULL')).join(',')})`;

  const res: T = (await entityManager.query(sql, params))[0];
  if (isArray(res)) {
    return res.map((x) => {
      const camelized = camelize(x);
      return zodSchema?.parse(camelized) ?? camelized;
    });
  } else {
    const camelized = camelize(res);
    return zodSchema?.parse(camelized) ?? camelized;
  }
};

export const createTypesafeSqlProc = <
  T extends ZodSchema,
  U extends Record<string, { order: number; isOptional?: boolean }>
>(
  sprocName: string,
  zodSchema: T,
  orderedParamsMap: U
) => {
  type TType = z.infer<typeof zodSchema>;
  type Params = Record<NonFunctionKeys<U>, unknown>;

  return class TypesafeSqlProc {
    static async getOne(entityManager: EntityManager, params: Params): Promise<TType> {
      const orderedParams = this.calculateOrderedParams(params);
      const result = await typesafeSqlProc<TType>(entityManager, sprocName, orderedParams, zodSchema);
      return result;
    }

    static async getMany(entityManager: EntityManager, params: Record<NonFunctionKeys<U>, unknown>): Promise<TType[]> {
      const orderedParams = this.calculateOrderedParams(params);
      const result = await typesafeSqlProc<TType[]>(entityManager, sprocName, orderedParams, zodSchema);
      return result;
    }

    static calculateOrderedParams(params: Record<NonFunctionKeys<U>, unknown>) {
      const orderedParams = Object.entries(params).reduce((acc, [key, val]) => {
        const valFromMap = orderedParamsMap[key];
        if (isNil(val) && !(valFromMap.isOptional ?? false)) {
          throw new Error(`Param '${key}' must be defined for sproc '${sprocName}'`);
        }
        acc[valFromMap.order] = val;
        return acc;
      }, [] as unknown[]);
      return orderedParams;
    }
  };
};
