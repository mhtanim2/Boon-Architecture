import { differenceWith, isObject } from 'lodash';
import { EntityTarget, FindOptionsWhere, In, InstanceChecker, ObjectLiteral, Repository, TypeORMError } from 'typeorm';

/**
 * Finds the entity that matches given id.
 * If an entity was not found in the database - rejects with error.
 */
export const findOneByIdOrFail = async <Entity extends ObjectLiteral>(
  repository: Repository<Entity>,
  field: keyof Entity,
  id: number | string,
  andWhere?: FindOptionsWhere<Entity>
): Promise<Entity> => {
  const where = { ...(andWhere ?? {}), [field]: id } as FindOptionsWhere<Entity>;
  return repository.findOneBy(where).then((value) => {
    if (value === null) {
      return Promise.reject(new EntityNotFoundByIdError(repository.target, where, id));
    }
    return Promise.resolve(value);
  });
};

/**
 * Finds all the entities that matches given ids.
 * If an entity was not found in the database - rejects with error.
 */
export const findByIdsOrFail = async <Entity extends ObjectLiteral>(
  repository: Repository<Entity>,
  field: keyof Entity,
  ids: (number | string)[],
  andWhere?: FindOptionsWhere<Entity>
): Promise<Entity[]> => {
  const where = { ...(andWhere ?? {}), [field]: In(ids) } as FindOptionsWhere<Entity>;
  return repository.findBy(where).then((value) => {
    const difference = differenceWith(ids, value, (a, b) => a === b[field]);
    if (difference.length > 0) {
      return Promise.reject(new EntitiesNotFoundByIdsError(repository.target, where, difference));
    }
    return Promise.resolve(value);
  });
};

/**
 * Thrown when no result could be found matching given id.
 */
export class EntityNotFoundByIdError extends TypeORMError {
  constructor(entityClass: EntityTarget<any>, criteria: any, id: number | string) {
    super();

    this.message = `Could not find any entity of type '${stringifyTarget(entityClass)}' ` + `matching id: '${id}'`;
  }
}

/**
 * Thrown when not all results could be found matching given ids.
 */
export class EntitiesNotFoundByIdsError extends TypeORMError {
  constructor(entityClass: EntityTarget<any>, criteria: any, difference: (number | string)[]) {
    super();

    this.message =
      `Could not find entities of type '${stringifyTarget(entityClass)}' ` + `matching ids: [${difference.join(', ')}]`;
  }
}

const stringifyTarget = (target: EntityTarget<any>): string => {
  if (InstanceChecker.isEntitySchema(target)) {
    return target.options.name;
  } else if (typeof target === 'function') {
    return target.name;
  } else if (isObject(target) && 'name' in (target as any)) {
    return (target as any).name;
  } else {
    return target as any;
  }
};
