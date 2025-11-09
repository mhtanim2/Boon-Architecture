import { head, merge } from 'lodash';

export const mapToObjectLiteral = (
  map: Map<string | number, any>,
  opts?: { getFirstElementOfMapIfArray: boolean }
): Record<string, any> => {
  const defaultOpts = { getFirstElementOfMapIfArray: false };
  opts = merge({}, defaultOpts, opts);

  const record: Record<string, any> = {};
  for (const [key, value] of Object.entries(Object.fromEntries(map))) {
    record[key] = opts.getFirstElementOfMapIfArray ? head(value)! : value;
  }
  return record;
};
