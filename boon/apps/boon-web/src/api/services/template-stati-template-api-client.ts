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
import { StatoTemplateResDto } from '../models/stato-template-res-dto';
import { StatoTemplateResExcerptDto } from '../models/stato-template-res-excerpt-dto';
import { UpdateStatoTemplateDto } from '../models/update-stato-template-dto';

@Injectable({ providedIn: 'root' })
export class TemplateStatiTemplateApiClient extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient, private readonly tenantResolver: ActiveTenantResolver,
) {
    super(config, http);
  }

  /** Path part for operation `statiTemplateControllerFindStatiTemplate()` */
  static readonly StatiTemplateControllerFindStatiTemplatePath = '/admin/template/stati-template';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `statiTemplateControllerFindStatiTemplate()` instead.
   *
   * This method doesn't expect any request body.
   */
  statiTemplateControllerFindStatiTemplate$Response(
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
'data'?: Array<StatoTemplateResExcerptDto>;
}>> {
    const rb = new RequestBuilder(this.rootUrl, TemplateStatiTemplateApiClient.StatiTemplateControllerFindStatiTemplatePath, 'get');
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
        'data'?: Array<StatoTemplateResExcerptDto>;
        }>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `statiTemplateControllerFindStatiTemplate$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  statiTemplateControllerFindStatiTemplate(
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
'data'?: Array<StatoTemplateResExcerptDto>;
}> {
    return this.statiTemplateControllerFindStatiTemplate$Response(params, context).pipe(
      map((r: StrictHttpResponse<PaginatedResponseDto & {
'data'?: Array<StatoTemplateResExcerptDto>;
}>): PaginatedResponseDto & {
'data'?: Array<StatoTemplateResExcerptDto>;
} => r.body)
    );
  }

  /** Path part for operation `statiTemplateControllerFindOneStatoTemplateById()` */
  static readonly StatiTemplateControllerFindOneStatoTemplateByIdPath = '/admin/template/stati-template/id/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `statiTemplateControllerFindOneStatoTemplateById()` instead.
   *
   * This method doesn't expect any request body.
   */
  statiTemplateControllerFindOneStatoTemplateById$Response(
    params: {
      id: number;
    },
    context?: HttpContext
): Observable<StrictHttpResponse<StatoTemplateResDto>> {
    const rb = new RequestBuilder(this.rootUrl, TemplateStatiTemplateApiClient.StatiTemplateControllerFindOneStatoTemplateByIdPath, 'get');
    if (params) {
      rb.path('id', params.id, {});
    }

    return this.http.request(
      rb.build({ responseType: 'json', accept: 'application/json', context })
    ).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<StatoTemplateResDto>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `statiTemplateControllerFindOneStatoTemplateById$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  statiTemplateControllerFindOneStatoTemplateById(
    params: {
      id: number;
    },
    context?: HttpContext
): Observable<StatoTemplateResDto> {
    return this.statiTemplateControllerFindOneStatoTemplateById$Response(params, context).pipe(
      map((r: StrictHttpResponse<StatoTemplateResDto>): StatoTemplateResDto => r.body)
    );
  }

  /** Path part for operation `statiTemplateControllerUpdateStatoTemplate()` */
  static readonly StatiTemplateControllerUpdateStatoTemplatePath = '/admin/template/stati-template/id/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `statiTemplateControllerUpdateStatoTemplate()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  statiTemplateControllerUpdateStatoTemplate$Response(
    params: {
      id: number;
      body: UpdateStatoTemplateDto
    },
    context?: HttpContext
): Observable<StrictHttpResponse<StatoTemplateResDto>> {
    const rb = new RequestBuilder(this.rootUrl, TemplateStatiTemplateApiClient.StatiTemplateControllerUpdateStatoTemplatePath, 'patch');
    if (params) {
      rb.path('id', params.id, {});
      rb.body(params.body, 'application/json');
    }

    return this.http.request(
      rb.build({ responseType: 'json', accept: 'application/json', context })
    ).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<StatoTemplateResDto>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `statiTemplateControllerUpdateStatoTemplate$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  statiTemplateControllerUpdateStatoTemplate(
    params: {
      id: number;
      body: UpdateStatoTemplateDto
    },
    context?: HttpContext
): Observable<StatoTemplateResDto> {
    return this.statiTemplateControllerUpdateStatoTemplate$Response(params, context).pipe(
      map((r: StrictHttpResponse<StatoTemplateResDto>): StatoTemplateResDto => r.body)
    );
  }

}
