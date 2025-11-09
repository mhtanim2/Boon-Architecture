import { clone, each } from 'lodash';

export const coerceRecordTypes = (raw: Record<string, any>): Record<string, string | number | boolean | undefined> => {
  raw = clone(raw);
  return each(raw, (value, key) => {
    if (value === 'true') raw[key] = true;
    if (value === 'false') raw[key] = false;
    if (value === 'null') raw[key] = null;
    if (!isNaN(Number(value))) raw[key] = Number(value);
  });
};
