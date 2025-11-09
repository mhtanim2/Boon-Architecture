import { ValueTransformer } from 'typeorm';

class BoolTinyIntTransformer implements ValueTransformer {
  // To database from TypeORM
  to(value: boolean | null): number | null {
    if (value === null) {
      return null;
    }
    return value ? 1 : 0;
  }

  // From database to TypeORM
  from(value: number): boolean | null {
    if (value === null) {
      return null;
    }
    return !!value;
  }
}
export const boolTinyIntTransformer = new BoolTinyIntTransformer();
