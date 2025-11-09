export type FilterOperator = '$eq' | '$gt' | '$gte' | '$in' | '$null' | '$lt' | '$lte' | '$btw' | '$ilike' | '$sw';
export type FilterSuffix = '$not' | '$or';
export type OrderSort = 'ASC' | 'DESC';

export type FilterEntry = [string, [FilterOperator, FilterSuffix?], any];
export type OrderEntry = [string, OrderSort];

export class PaginationQueryString {
  readonly filter?: FilterEntry[];
  readonly sortBy?: OrderEntry[];
  readonly search?: string;
  readonly limit?: number;
  readonly page?: number;

  /**
   *  @deprecated Use the static method {@link PaginationQueryString.builder()} or the {@link PaginationQueryStringBuilder} instead.
   */
  constructor(query: Partial<PaginationQueryString>) {
    if (query.filter != undefined) this.filter = query.filter;
    if (query.sortBy != undefined) this.sortBy = query.sortBy;
    if (query.search != undefined) this.search = query.search;
    if (query.limit != undefined) this.limit = query.limit;
    if (query.page != undefined) this.page = query.page;
  }

  static builder(query?: Partial<PaginationQueryString>): PaginationQueryStringBuilder {
    return new PaginationQueryStringBuilder(query);
  }

  paramsify(): Record<string, unknown> {
    const params: Record<string, unknown> = {};

    if (this.limit !== undefined) {
      params['limit'] = this.limit;
    }
    if (this.page !== undefined) {
      params['page'] = this.page;
    }
    if (this.sortBy !== undefined) {
      params['sortBy'] = this.sortBy.map(([field, sort]) => {
        return `${field}:${sort}`;
      });
    }
    if (this.search !== undefined) {
      params['search'] = this.search;
    }
    if (this.filter !== undefined) {
      this.filter.forEach(([field, operators, filter]) => {
        const [operator, suffix] = operators;
        params[`filter.${field}`] = `${suffix ? `${suffix}:` : ''}${operator}:${filter}`;
      });
    }

    return params;
  }

  stringify(): string {
    const params: string[] = [];

    if (this.limit !== undefined) {
      params.push(`limit=${this.limit}`);
    }
    if (this.page !== undefined) {
      params.push(`page=${this.page}`);
    }
    if (this.sortBy !== undefined) {
      params.push(
        ...this.sortBy.map(([field, sort]) => {
          return `sortBy=${field}:${sort}`;
        })
      );
    }
    if (this.search !== undefined) {
      params.push(`search=${this.search}`);
    }
    if (this.filter !== undefined) {
      params.push(
        ...this.filter.map(([field, operators, filter]) => {
          const [operator, suffix] = operators;
          return `filter.${field}=${suffix ? `${suffix}:` : ''}${operator}:${filter}`;
        })
      );
    }

    return params.join('&');
  }
}

export class PaginationQueryStringBuilder {
  private filter?: FilterEntry[];
  private sortBy?: OrderEntry[];
  private search?: string;
  private limit?: number;
  private page?: number;

  constructor(query?: Partial<PaginationQueryString>) {
    if (!query) return;

    if (query.filter != undefined) query.filter.forEach((f) => this.addFilter(f[0], f[1], f[2]));
    if (query.sortBy != undefined) query.sortBy.forEach((s) => this.addOrder(s[0], s[1]));
    if (query.search != undefined) this.setSearch(query.search);
    this.setPagination({ limit: query.limit, page: query.page });
  }

  setPagination(opts: Pick<PaginationQueryString, 'limit' | 'page'>): PaginationQueryStringBuilder {
    if (opts.limit !== undefined && !(opts.limit >= 0 && Number.isInteger(opts.limit))) {
      throw new Error(`Limit must be non-negative integer`);
    }

    if (opts.page !== undefined && !(opts.page >= 0 && Number.isInteger(opts.page))) {
      throw new Error(`Page must be non-negative integer`);
    }

    this.limit = opts.limit;
    this.page = opts.page;
    return this;
  }

  setSearch(value: string): PaginationQueryStringBuilder {
    this.search = value;
    return this;
  }

  clearFilter(field: string) {
    this.filter ??= [];
    this.filter = this.filter?.filter((x) => x[0] !== field);
    return this;
  }

  addFilter(field: string, operators: [FilterOperator, FilterSuffix?], value: any): PaginationQueryStringBuilder {
    this.filter ??= [];
    this.filter.push([field, operators, value]);
    return this;
  }

  addOrder(field: string, sort: OrderSort): PaginationQueryStringBuilder {
    this.sortBy ??= [];
    this.sortBy.push([field, sort]);
    return this;
  }

  finalize(): PaginationQueryString {
    return new PaginationQueryString({
      filter: this.filter,
      sortBy: this.sortBy,
      search: this.search,
      limit: this.limit,
      page: this.page,
    });
  }
}
