import { FilterOperator, FilterSuffix, PaginationQueryString } from '@boon/common/core';
import { dayjs } from '@boon/common/dayjs';
import { isArray, isDate, isNull, negate } from 'lodash';
import { FilterMetadata, LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';

const convertValue = (value: any): string => {
  if (isDate(value)) {
    return dayjs(value).format('YYYY-MM-DD');
  }
  return value;
};

const convertOperators = (matchMode: string | undefined): [FilterOperator, FilterSuffix?] => {
  switch (matchMode) {
    case 'startsWith':
      return ['$sw'];
    case 'between':
      return ['$btw'];
    case 'contains':
      return ['$ilike'];
    case 'notContains':
      return ['$ilike', '$not'];
    case 'equals':
    case 'is':
    case 'dateIs':
      return ['$eq'];
    case 'notEquals':
    case 'isNot':
      return ['$eq', '$not'];
    case 'in':
      return ['$in'];
    case 'lt':
    case 'before':
    case 'dateBefore':
      return ['$lt'];
    case 'lte':
      return ['$lte'];
    case 'gt':
    case 'after':
    case 'dateAfter':
      return ['$gt'];
    case 'gte':
      return ['$gte'];
    case 'endsWith':
      throw new Error(`PrimeNG filter 'endsWith' is not supported`);
    default:
      return ['$ilike'];
  }
};

export const convertLazyLoadEvent = (event: LazyLoadEvent): ReturnType<typeof PaginationQueryString.builder> => {
  const query = PaginationQueryString.builder();

  if (event.first != undefined) {
    const { first, rows } = event;
    const limit = rows ?? 20;
    const page = first / limit + 1;
    query.setPagination({ limit, page });
  }
  if (event.sortField !== undefined) {
    const { sortField, sortOrder } = event;
    const order = (sortOrder ?? 1) > 0 ? 'ASC' : 'DESC';
    query.addOrder(sortField, order);
  }
  for (const [filterKey, filterValue] of Object.entries(event.filters ?? {})) {
    const metadatas: FilterMetadata[] = isArray(filterValue) ? [...filterValue] : [filterValue];
    for (const metadata of metadatas.filter((x) => x.value && (x.value.length ?? 1) > 0)) {
      const value = convertValue(metadata.value);
      const operators = convertOperators(metadata.matchMode);

      const values = isArray(value) ? value : [value];
      if (values.some((value) => value === null) && operators[0] === '$in') {
        query.addFilter(filterKey, ['$null'], []);
        const nonNullValues = values.filter(negate(isNull));
        if (nonNullValues.length > 0) {
          query.addFilter(filterKey, ['$in', '$or'], nonNullValues);
        }
      } else {
        query.addFilter(filterKey, operators, value);
      }
    }
  }
  if (event.globalFilter != undefined) {
    query.setSearch(event.globalFilter);
  }

  return query;
};

export const getInitialTableLazyLoadEvent = (table: Table) => ({
  first: 0,
  rows: table.rows,
  sortOrder: table.sortOrder,
  sortField: table.sortField,
  multiSortMeta: table.multiSortMeta,
});
