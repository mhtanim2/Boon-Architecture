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
import { StatoRevisioneResDto } from '../models/stato-revisione-res-dto';
import { StatoRevisioneResExcerptDto } from '../models/stato-revisione-res-excerpt-dto';
import { UpdateStatoRevisioneDto } from '../models/update-stato-revisione-dto';

@Injectable({ providedIn: 'root' })
export class RevisioniStatiRevisioniApiClient extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient, private readonly tenantResolver: ActiveTenantResolver,
) {
    super(config, http);
  }

  /** Path part for operation `statiRevisioniControllerFindStatiRevisioni()` */
  static readonly StatiRevisioniControllerFindStatiRevisioniPath = '/admin/revisioni/stati-revisioni';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `statiRevisioniControllerFindStatiRevisioni()` instead.
   *
   * This method doesn't expect any request body.
   */
  statiRevisioniControllerFindStatiRevisioni$Response(
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
'data'?: Array<StatoRevisioneResExcerptDto>;
}>> {
    const rb = new RequestBuilder(this.rootUrl, RevisioniStatiRevisioniApiClient.StatiRevisioniControllerFindStatiRevisioniPath, 'get');
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
        'data'?: Array<StatoRevisioneResExcerptDto>;
        }>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `statiRevisioniControllerFindStatiRevisioni$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  statiRevisioniControllerFindStatiRevisioni(
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
'data'?: Array<StatoRevisioneResExcerptDto>;
}> {
    return this.statiRevisioniControllerFindStatiRevisioni$Response(params, context).pipe(
      map((r: StrictHttpResponse<PaginatedResponseDto & {
'data'?: Array<StatoRevisioneResExcerptDto>;
}>): PaginatedResponseDto & {
'data'?: Array<StatoRevisioneResExcerptDto>;
} => r.body)
    );
  }

  /** Path part for operation `statiRevisioniControllerFindOneStatoRevisioniById()` */
  static readonly StatiRevisioniControllerFindOneStatoRevisioniByIdPath = '/admin/revisioni/stati-revisioni/id/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `statiRevisioniControllerFindOneStatoRevisioniById()` instead.
   *
   * This method doesn't expect any request body.
   */
  statiRevisioniControllerFindOneStatoRevisioniById$Response(
    params: {
      id: number;
    },
    context?: HttpContext
): Observable<StrictHttpResponse<StatoRevisioneResDto>> {
    const rb = new RequestBuilder(this.rootUrl, RevisioniStatiRevisioniApiClient.StatiRevisioniControllerFindOneStatoRevisioniByIdPath, 'get');
    if (params) {
      rb.path('id', params.id, {});
    }

    return this.http.request(
      rb.build({ responseType: 'json', accept: 'application/json', context })
    ).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<StatoRevisioneResDto>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `statiRevisioniControllerFindOneStatoRevisioniById$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  statiRevisioniControllerFindOneStatoRevisioniById(
    params: {
      id: number;
    },
    context?: HttpContext
): Observable<StatoRevisioneResDto> {
    return this.statiRevisioniControllerFindOneStatoRevisioniById$Response(params, context).pipe(
      map((r: StrictHttpResponse<StatoRevisioneResDto>): StatoRevisioneResDto => r.body)
    );
  }

  /** Path part for operation `statiRevisioniControllerUpdateStatoRevisione()` */
  static readonly StatiRevisioniControllerUpdateStatoRevisionePath = '/admin/revisioni/stati-revisioni/id/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `statiRevisioniControllerUpdateStatoRevisione()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  statiRevisioniControllerUpdateStatoRevisione$Response(
    params: {
      id: number;
      body: UpdateStatoRevisioneDto
    },
    context?: HttpContext
): Observable<StrictHttpResponse<StatoRevisioneResDto>> {
    const rb = new RequestBuilder(this.rootUrl, RevisioniStatiRevisioniApiClient.StatiRevisioniControllerUpdateStatoRevisionePath, 'patch');
    if (params) {
      rb.path('id', params.id, {});
      rb.body(params.body, 'application/json');
    }

    return this.http.request(
      rb.build({ responseType: 'json', accept: 'application/json', context })
    ).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<StatoRevisioneResDto>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `statiRevisioniControllerUpdateStatoRevisione$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  statiRevisioniControllerUpdateStatoRevisione(
    params: {
      id: number;
      body: UpdateStatoRevisioneDto
    },
    context?: HttpContext
): Observable<StatoRevisioneResDto> {
    return this.statiRevisioniControllerUpdateStatoRevisione$Response(params, context).pipe(
      map((r: StrictHttpResponse<StatoRevisioneResDto>): StatoRevisioneResDto => r.body)
    );
  }

}
