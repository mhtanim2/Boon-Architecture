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

import { GenereResDto } from '../models/genere-res-dto';
import { GenereResExcerptDto } from '../models/genere-res-excerpt-dto';
import { PaginatedResponseDto } from '../models/paginated-response-dto';
import { UpdateGenereDto } from '../models/update-genere-dto';

@Injectable({ providedIn: 'root' })
export class AdminGeneriApiClient extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient, private readonly tenantResolver: ActiveTenantResolver,
) {
    super(config, http);
  }

  /** Path part for operation `generiControllerFindGeneri()` */
  static readonly GeneriControllerFindGeneriPath = '/admin/generi';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `generiControllerFindGeneri()` instead.
   *
   * This method doesn't expect any request body.
   */
  generiControllerFindGeneri$Response(
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
'data'?: Array<GenereResExcerptDto>;
}>> {
    const rb = new RequestBuilder(this.rootUrl, AdminGeneriApiClient.GeneriControllerFindGeneriPath, 'get');
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
        'data'?: Array<GenereResExcerptDto>;
        }>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `generiControllerFindGeneri$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  generiControllerFindGeneri(
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
'data'?: Array<GenereResExcerptDto>;
}> {
    return this.generiControllerFindGeneri$Response(params, context).pipe(
      map((r: StrictHttpResponse<PaginatedResponseDto & {
'data'?: Array<GenereResExcerptDto>;
}>): PaginatedResponseDto & {
'data'?: Array<GenereResExcerptDto>;
} => r.body)
    );
  }

  /** Path part for operation `generiControllerFindOneGenereById()` */
  static readonly GeneriControllerFindOneGenereByIdPath = '/admin/generi/id/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `generiControllerFindOneGenereById()` instead.
   *
   * This method doesn't expect any request body.
   */
  generiControllerFindOneGenereById$Response(
    params: {
      id: number;
    },
    context?: HttpContext
): Observable<StrictHttpResponse<GenereResDto>> {
    const rb = new RequestBuilder(this.rootUrl, AdminGeneriApiClient.GeneriControllerFindOneGenereByIdPath, 'get');
    if (params) {
      rb.path('id', params.id, {});
    }

    return this.http.request(
      rb.build({ responseType: 'json', accept: 'application/json', context })
    ).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<GenereResDto>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `generiControllerFindOneGenereById$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  generiControllerFindOneGenereById(
    params: {
      id: number;
    },
    context?: HttpContext
): Observable<GenereResDto> {
    return this.generiControllerFindOneGenereById$Response(params, context).pipe(
      map((r: StrictHttpResponse<GenereResDto>): GenereResDto => r.body)
    );
  }

  /** Path part for operation `generiControllerUpdateGenere()` */
  static readonly GeneriControllerUpdateGenerePath = '/admin/generi/id/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `generiControllerUpdateGenere()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  generiControllerUpdateGenere$Response(
    params: {
      id: number;
      body: UpdateGenereDto
    },
    context?: HttpContext
): Observable<StrictHttpResponse<GenereResDto>> {
    const rb = new RequestBuilder(this.rootUrl, AdminGeneriApiClient.GeneriControllerUpdateGenerePath, 'patch');
    if (params) {
      rb.path('id', params.id, {});
      rb.body(params.body, 'application/json');
    }

    return this.http.request(
      rb.build({ responseType: 'json', accept: 'application/json', context })
    ).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<GenereResDto>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `generiControllerUpdateGenere$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  generiControllerUpdateGenere(
    params: {
      id: number;
      body: UpdateGenereDto
    },
    context?: HttpContext
): Observable<GenereResDto> {
    return this.generiControllerUpdateGenere$Response(params, context).pipe(
      map((r: StrictHttpResponse<GenereResDto>): GenereResDto => r.body)
    );
  }

}
