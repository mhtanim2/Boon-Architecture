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
import { StatoArticoloResDto } from '../models/stato-articolo-res-dto';
import { StatoArticoloResExcerptDto } from '../models/stato-articolo-res-excerpt-dto';
import { UpdateStatoArticoloDto } from '../models/update-stato-articolo-dto';

@Injectable({ providedIn: 'root' })
export class ArticoliStatiArticoliApiClient extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient, private readonly tenantResolver: ActiveTenantResolver,
) {
    super(config, http);
  }

  /** Path part for operation `statiArticoliControllerFindStatiArticoli()` */
  static readonly StatiArticoliControllerFindStatiArticoliPath = '/admin/articoli/stati-articoli';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `statiArticoliControllerFindStatiArticoli()` instead.
   *
   * This method doesn't expect any request body.
   */
  statiArticoliControllerFindStatiArticoli$Response(
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
'data'?: Array<StatoArticoloResExcerptDto>;
}>> {
    const rb = new RequestBuilder(this.rootUrl, ArticoliStatiArticoliApiClient.StatiArticoliControllerFindStatiArticoliPath, 'get');
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
        'data'?: Array<StatoArticoloResExcerptDto>;
        }>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `statiArticoliControllerFindStatiArticoli$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  statiArticoliControllerFindStatiArticoli(
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
'data'?: Array<StatoArticoloResExcerptDto>;
}> {
    return this.statiArticoliControllerFindStatiArticoli$Response(params, context).pipe(
      map((r: StrictHttpResponse<PaginatedResponseDto & {
'data'?: Array<StatoArticoloResExcerptDto>;
}>): PaginatedResponseDto & {
'data'?: Array<StatoArticoloResExcerptDto>;
} => r.body)
    );
  }

  /** Path part for operation `statiArticoliControllerFindOneStatoArticoliById()` */
  static readonly StatiArticoliControllerFindOneStatoArticoliByIdPath = '/admin/articoli/stati-articoli/id/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `statiArticoliControllerFindOneStatoArticoliById()` instead.
   *
   * This method doesn't expect any request body.
   */
  statiArticoliControllerFindOneStatoArticoliById$Response(
    params: {
      id: number;
    },
    context?: HttpContext
): Observable<StrictHttpResponse<StatoArticoloResDto>> {
    const rb = new RequestBuilder(this.rootUrl, ArticoliStatiArticoliApiClient.StatiArticoliControllerFindOneStatoArticoliByIdPath, 'get');
    if (params) {
      rb.path('id', params.id, {});
    }

    return this.http.request(
      rb.build({ responseType: 'json', accept: 'application/json', context })
    ).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<StatoArticoloResDto>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `statiArticoliControllerFindOneStatoArticoliById$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  statiArticoliControllerFindOneStatoArticoliById(
    params: {
      id: number;
    },
    context?: HttpContext
): Observable<StatoArticoloResDto> {
    return this.statiArticoliControllerFindOneStatoArticoliById$Response(params, context).pipe(
      map((r: StrictHttpResponse<StatoArticoloResDto>): StatoArticoloResDto => r.body)
    );
  }

  /** Path part for operation `statiArticoliControllerUpdateStatoArticolo()` */
  static readonly StatiArticoliControllerUpdateStatoArticoloPath = '/admin/articoli/stati-articoli/id/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `statiArticoliControllerUpdateStatoArticolo()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  statiArticoliControllerUpdateStatoArticolo$Response(
    params: {
      id: number;
      body: UpdateStatoArticoloDto
    },
    context?: HttpContext
): Observable<StrictHttpResponse<StatoArticoloResDto>> {
    const rb = new RequestBuilder(this.rootUrl, ArticoliStatiArticoliApiClient.StatiArticoliControllerUpdateStatoArticoloPath, 'patch');
    if (params) {
      rb.path('id', params.id, {});
      rb.body(params.body, 'application/json');
    }

    return this.http.request(
      rb.build({ responseType: 'json', accept: 'application/json', context })
    ).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<StatoArticoloResDto>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `statiArticoliControllerUpdateStatoArticolo$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  statiArticoliControllerUpdateStatoArticolo(
    params: {
      id: number;
      body: UpdateStatoArticoloDto
    },
    context?: HttpContext
): Observable<StatoArticoloResDto> {
    return this.statiArticoliControllerUpdateStatoArticolo$Response(params, context).pipe(
      map((r: StrictHttpResponse<StatoArticoloResDto>): StatoArticoloResDto => r.body)
    );
  }

}
