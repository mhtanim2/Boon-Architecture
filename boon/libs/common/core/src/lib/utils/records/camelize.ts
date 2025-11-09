// import { mapKeys, camelCase, isArray } from "lodash";
import camelcaseKeys from '@cjs-exporter/camelcase-keys';

// export const _camelize = <T extends readonly unknown[] | Record<string, unknown>>(
//   val: T,
// ) => {
//   const toCamel = <T extends object>(val:  T | null | undefined) => mapKeys(val, (v, k) => camelCase(k));
//   return isArray(val) ? val.map(toCamel) : toCamel(val);
// }

export const camelize = <T extends readonly unknown[] | Record<string, unknown>>(val: T) => camelcaseKeys(val);
