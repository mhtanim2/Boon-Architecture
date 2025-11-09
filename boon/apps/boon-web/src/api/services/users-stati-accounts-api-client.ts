/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { ActiveTenantResolver } from '../../app/core/guards/tenant.guard';

import { PaginatedResponseDto } from '../models/paginated-response-dto';
import { StatoAccountResDto } from '../models/stato-account-res-dto';
import { StatoAccountResExcerptDto } from '../models/stato-account-res-excerpt-dto';
import { UpdateStatoAccountDto } from '../models/update-stato-account-dto';

@Injectable({ providedIn: 'root' })
export class UsersStatiAccountsApiClient extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient, private readonly tenantResolver: ActiveTenantResolver,
) {
    super(config, http);
  }

  /** Path part for operation `statiAccountsControllerFindStatiAccounts()` */
  static readonly StatiAccountsControllerFindStatiAccountsPath = '/admin/users/stati-accounts';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `statiAccountsControllerFindStatiAccounts()` instead.
   *
   * This method doesn't expect any request body.
   */
  statiAccountsControllerFindStatiAccounts$Response(
    params?: {

    /**
     * Page number (starting from 1)
     */
      page?: any;

    /**
     * Number of records per page
     */
      limit?: any;

    /**
     * Multicolumn search term
     */
      search?: any;

    /**
     * Limit columns to which apply 'search' term
     */
      searchBy?: Array<string>;

    /**
     * Format: _field_:_direction_ [direction may be ASC or DESC] e.g. id:DESC
     */
      sortBy?: Array<any>;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.id'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.nome'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.descrizione'?: any;
    },
    context?: HttpContext
): Observable<StrictHttpResponse<PaginatedResponseDto & {
'data'?: Array<StatoAccountResExcerptDto>;
}>> {
    const rb = new RequestBuilder(this.rootUrl, UsersStatiAccountsApiClient.StatiAccountsControllerFindStatiAccountsPath, 'get');
    if (params) {
      rb.query('page', params.page, {});
      rb.query('limit', params.limit, {});
      rb.query('search', params.search, {});
      rb.query('searchBy', params.searchBy, {});
      rb.query('sortBy', params.sortBy, {});
      rb.query('filter.id', params['filter.id'], {});
      rb.query('filter.nome', params['filter.nome'], {});
      rb.query('filter.descrizione', params['filter.descrizione'], {});
    }

    return this.http.request(
      rb.build({ responseType: 'json', accept: 'application/json', context })
    ).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<PaginatedResponseDto & {
        'data'?: Array<StatoAccountResExcerptDto>;
        }>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `statiAccountsControllerFindStatiAccounts$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  statiAccountsControllerFindStatiAccounts(
    params?: {

    /**
     * Page number (starting from 1)
     */
      page?: any;

    /**
     * Number of records per page
     */
      limit?: any;

    /**
     * Multicolumn search term
     */
      search?: any;

    /**
     * Limit columns to which apply 'search' term
     */
      searchBy?: Array<string>;

    /**
     * Format: _field_:_direction_ [direction may be ASC or DESC] e.g. id:DESC
     */
      sortBy?: Array<any>;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.id'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.nome'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.descrizione'?: any;
    },
    context?: HttpContext
): Observable<PaginatedResponseDto & {
'data'?: Array<StatoAccountResExcerptDto>;
}> {
    return this.statiAccountsControllerFindStatiAccounts$Response(params, context).pipe(
      map((r: StrictHttpResponse<PaginatedResponseDto & {
'data'?: Array<StatoAccountResExcerptDto>;
}>): PaginatedResponseDto & {
'data'?: Array<StatoAccountResExcerptDto>;
} => r.body)
    );
  }

  /** Path part for operation `statiAccountsControllerFindOneStatoAccountsById()` */
  static readonly StatiAccountsControllerFindOneStatoAccountsByIdPath = '/admin/users/stati-accounts/id/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `statiAccountsControllerFindOneStatoAccountsById()` instead.
   *
   * This method doesn't expect any request body.
   */
  statiAccountsControllerFindOneStatoAccountsById$Response(
    params: {
      id: number;
    },
    context?: HttpContext
): Observable<StrictHttpResponse<StatoAccountResDto>> {
    const rb = new RequestBuilder(this.rootUrl, UsersStatiAccountsApiClient.StatiAccountsControllerFindOneStatoAccountsByIdPath, 'get');
    if (params) {
      rb.path('id', params.id, {});
    }

    return this.http.request(
      rb.build({ responseType: 'json', accept: 'application/json', context })
    ).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<StatoAccountResDto>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `statiAccountsControllerFindOneStatoAccountsById$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  statiAccountsControllerFindOneStatoAccountsById(
    params: {
      id: number;
    },
    context?: HttpContext
): Observable<StatoAccountResDto> {
    return this.statiAccountsControllerFindOneStatoAccountsById$Response(params, context).pipe(
      map((r: StrictHttpResponse<StatoAccountResDto>): StatoAccountResDto => r.body)
    );
  }

  /** Path part for operation `statiAccountsControllerUpdateStatoAccount()` */
  static readonly StatiAccountsControllerUpdateStatoAccountPath = '/admin/users/stati-accounts/id/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `statiAccountsControllerUpdateStatoAccount()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  statiAccountsControllerUpdateStatoAccount$Response(
    params: {
      id: number;
      body: UpdateStatoAccountDto
    },
    context?: HttpContext
): Observable<StrictHttpResponse<StatoAccountResDto>> {
    const rb = new RequestBuilder(this.rootUrl, UsersStatiAccountsApiClient.StatiAccountsControllerUpdateStatoAccountPath, 'patch');
    if (params) {
      rb.path('id', params.id, {});
      rb.body(params.body, 'application/json');
    }

    return this.http.request(
      rb.build({ responseType: 'json', accept: 'application/json', context })
    ).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<StatoAccountResDto>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `statiAccountsControllerUpdateStatoAccount$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  statiAccountsControllerUpdateStatoAccount(
    params: {
      id: number;
      body: UpdateStatoAccountDto
    },
    context?: HttpContext
): Observable<StatoAccountResDto> {
    return this.statiAccountsControllerUpdateStatoAccount$Response(params, context).pipe(
      map((r: StrictHttpResponse<StatoAccountResDto>): StatoAccountResDto => r.body)
    );
  }

}
