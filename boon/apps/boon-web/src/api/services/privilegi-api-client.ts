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

import { LivelloPrivilegioResDto } from '../models/livello-privilegio-res-dto';
import { PaginatedResponseDto } from '../models/paginated-response-dto';
import { RuoloResExcerptDto } from '../models/ruolo-res-excerpt-dto';
import { UpdateLivelloPrivilegioDto } from '../models/update-livello-privilegio-dto';

@Injectable({ providedIn: 'root' })
export class PrivilegiApiClient extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient, private readonly tenantResolver: ActiveTenantResolver,
) {
    super(config, http);
  }

  /** Path part for operation `ruoliControllerFindRuoli()` */
  static readonly RuoliControllerFindRuoliPath = '/admin/privilegi/ruoli';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `ruoliControllerFindRuoli()` instead.
   *
   * This method doesn't expect any request body.
   */
  ruoliControllerFindRuoli$Response(
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
'data'?: Array<RuoloResExcerptDto>;
}>> {
    const rb = new RequestBuilder(this.rootUrl, PrivilegiApiClient.RuoliControllerFindRuoliPath, 'get');
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
        'data'?: Array<RuoloResExcerptDto>;
        }>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `ruoliControllerFindRuoli$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  ruoliControllerFindRuoli(
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
'data'?: Array<RuoloResExcerptDto>;
}> {
    return this.ruoliControllerFindRuoli$Response(params, context).pipe(
      map((r: StrictHttpResponse<PaginatedResponseDto & {
'data'?: Array<RuoloResExcerptDto>;
}>): PaginatedResponseDto & {
'data'?: Array<RuoloResExcerptDto>;
} => r.body)
    );
  }

  /** Path part for operation `ruoliControllerFindOneRuoloById()` */
  static readonly RuoliControllerFindOneRuoloByIdPath = '/admin/privilegi/ruoli/id/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `ruoliControllerFindOneRuoloById()` instead.
   *
   * This method doesn't expect any request body.
   */
  ruoliControllerFindOneRuoloById$Response(
    params: {
      id: number;
    },
    context?: HttpContext
): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, PrivilegiApiClient.RuoliControllerFindOneRuoloByIdPath, 'get');
    if (params) {
      rb.path('id', params.id, {});
    }

    return this.http.request(
      rb.build({ responseType: 'text', accept: '*/*', context })
    ).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `ruoliControllerFindOneRuoloById$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  ruoliControllerFindOneRuoloById(
    params: {
      id: number;
    },
    context?: HttpContext
): Observable<void> {
    return this.ruoliControllerFindOneRuoloById$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  /** Path part for operation `livelliPrivilegioPublicControllerFindLivelliPrivilegio()` */
  static readonly LivelliPrivilegioPublicControllerFindLivelliPrivilegioPath = '/admin/privilegi/livelli';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `livelliPrivilegioPublicControllerFindLivelliPrivilegio()` instead.
   *
   * This method doesn't expect any request body.
   */
  livelliPrivilegioPublicControllerFindLivelliPrivilegio$Response(
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
'data'?: Array<LivelloPrivilegioResDto>;
}>> {
    const rb = new RequestBuilder(this.rootUrl, PrivilegiApiClient.LivelliPrivilegioPublicControllerFindLivelliPrivilegioPath, 'get');
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
        'data'?: Array<LivelloPrivilegioResDto>;
        }>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `livelliPrivilegioPublicControllerFindLivelliPrivilegio$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  livelliPrivilegioPublicControllerFindLivelliPrivilegio(
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
'data'?: Array<LivelloPrivilegioResDto>;
}> {
    return this.livelliPrivilegioPublicControllerFindLivelliPrivilegio$Response(params, context).pipe(
      map((r: StrictHttpResponse<PaginatedResponseDto & {
'data'?: Array<LivelloPrivilegioResDto>;
}>): PaginatedResponseDto & {
'data'?: Array<LivelloPrivilegioResDto>;
} => r.body)
    );
  }

  /** Path part for operation `livelliPrivilegioPublicControllerFindOneLivelloPrivilegioById()` */
  static readonly LivelliPrivilegioPublicControllerFindOneLivelloPrivilegioByIdPath = '/admin/privilegi/livelli/id/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `livelliPrivilegioPublicControllerFindOneLivelloPrivilegioById()` instead.
   *
   * This method doesn't expect any request body.
   */
  livelliPrivilegioPublicControllerFindOneLivelloPrivilegioById$Response(
    params: {
      id: number;
    },
    context?: HttpContext
): Observable<StrictHttpResponse<LivelloPrivilegioResDto>> {
    const rb = new RequestBuilder(this.rootUrl, PrivilegiApiClient.LivelliPrivilegioPublicControllerFindOneLivelloPrivilegioByIdPath, 'get');
    if (params) {
      rb.path('id', params.id, {});
    }

    return this.http.request(
      rb.build({ responseType: 'json', accept: 'application/json', context })
    ).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<LivelloPrivilegioResDto>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `livelliPrivilegioPublicControllerFindOneLivelloPrivilegioById$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  livelliPrivilegioPublicControllerFindOneLivelloPrivilegioById(
    params: {
      id: number;
    },
    context?: HttpContext
): Observable<LivelloPrivilegioResDto> {
    return this.livelliPrivilegioPublicControllerFindOneLivelloPrivilegioById$Response(params, context).pipe(
      map((r: StrictHttpResponse<LivelloPrivilegioResDto>): LivelloPrivilegioResDto => r.body)
    );
  }

  /** Path part for operation `livelliPrivilegioControllerUpdateLivelloPrivilegio()` */
  static readonly LivelliPrivilegioControllerUpdateLivelloPrivilegioPath = '/admin/privilegi/livelli/id/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `livelliPrivilegioControllerUpdateLivelloPrivilegio()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  livelliPrivilegioControllerUpdateLivelloPrivilegio$Response(
    params: {
      id: number;
      body: UpdateLivelloPrivilegioDto
    },
    context?: HttpContext
): Observable<StrictHttpResponse<LivelloPrivilegioResDto>> {
    const rb = new RequestBuilder(this.rootUrl, PrivilegiApiClient.LivelliPrivilegioControllerUpdateLivelloPrivilegioPath, 'patch');
    if (params) {
      rb.path('id', params.id, {});
      rb.body(params.body, 'application/json');
    }

    return this.http.request(
      rb.build({ responseType: 'json', accept: 'application/json', context })
    ).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<LivelloPrivilegioResDto>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `livelliPrivilegioControllerUpdateLivelloPrivilegio$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  livelliPrivilegioControllerUpdateLivelloPrivilegio(
    params: {
      id: number;
      body: UpdateLivelloPrivilegioDto
    },
    context?: HttpContext
): Observable<LivelloPrivilegioResDto> {
    return this.livelliPrivilegioControllerUpdateLivelloPrivilegio$Response(params, context).pipe(
      map((r: StrictHttpResponse<LivelloPrivilegioResDto>): LivelloPrivilegioResDto => r.body)
    );
  }

}
