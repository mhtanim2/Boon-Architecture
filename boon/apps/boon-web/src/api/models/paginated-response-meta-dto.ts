/* tslint:disable */
/* eslint-disable */
export interface PaginatedResponseMetaDto {
  currentPage: number;
  filter?: {
};
  itemsPerPage: number;
  search: string;
  searchBy: Array<string>;
  sortBy: Array<string>;
  totalItems: number;
  totalPages: number;
}
