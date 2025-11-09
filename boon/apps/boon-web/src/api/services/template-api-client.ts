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

import { CreateTemplateDto } from '../models/create-template-dto';
import { PaginatedResponseDto } from '../models/paginated-response-dto';
import { TemplateResDto } from '../models/template-res-dto';
import { TemplateResExcerptDto } from '../models/template-res-excerpt-dto';
import { UpdateTemplateDto } from '../models/update-template-dto';

@Injectable({ providedIn: 'root' })
export class TemplateApiClient extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient, private readonly tenantResolver: ActiveTenantResolver,
) {
    super(config, http);
  }

  /** Path part for operation `templateControllerFindTemplate()` */
  static readonly TemplateControllerFindTemplatePath = '/{tenant}/template';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `templateControllerFindTemplate()` instead.
   *
   * This method doesn't expect any request body.
   */
  templateControllerFindTemplate$Response(
    params: {

    /**
     * The slug of the tenant
     */
      tenant?: any;

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
      'filter.cliente.id'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.stato.id'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.funzionalita.id'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.nome'?: any;
    },
    context?: HttpContext
): Observable<StrictHttpResponse<PaginatedResponseDto & {
'data'?: Array<TemplateResExcerptDto>;
}>> {
    const rb = new RequestBuilder(this.rootUrl, TemplateApiClient.TemplateControllerFindTemplatePath, 'get');
    if (params) {
      rb.path('tenant', params['tenant'] ?? this.tenantResolver.resolve().slug, {});
      rb.query('page', params.page, {});
      rb.query('limit', params.limit, {});
      rb.query('search', params.search, {});
      rb.query('searchBy', params.searchBy, {});
      rb.query('sortBy', params.sortBy, {});
      rb.query('filter.id', params['filter.id'], {});
      rb.query('filter.cliente.id', params['filter.cliente.id'], {});
      rb.query('filter.stato.id', params['filter.stato.id'], {});
      rb.query('filter.funzionalita.id', params['filter.funzionalita.id'], {});
      rb.query('filter.nome', params['filter.nome'], {});
    }

    return this.http.request(
      rb.build({ responseType: 'json', accept: 'application/json', context })
    ).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<PaginatedResponseDto & {
        'data'?: Array<TemplateResExcerptDto>;
        }>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `templateControllerFindTemplate$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  templateControllerFindTemplate(
    params: {

    /**
     * The slug of the tenant
     */
      tenant?: any;

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
      'filter.cliente.id'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.stato.id'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.funzionalita.id'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.nome'?: any;
    },
    context?: HttpContext
): Observable<PaginatedResponseDto & {
'data'?: Array<TemplateResExcerptDto>;
}> {
    return this.templateControllerFindTemplate$Response(params, context).pipe(
      map((r: StrictHttpResponse<PaginatedResponseDto & {
'data'?: Array<TemplateResExcerptDto>;
}>): PaginatedResponseDto & {
'data'?: Array<TemplateResExcerptDto>;
} => r.body)
    );
  }

  /** Path part for operation `templateControllerCreateTemplate()` */
  static readonly TemplateControllerCreateTemplatePath = '/{tenant}/template';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `templateControllerCreateTemplate()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  templateControllerCreateTemplate$Response(
    params: {

    /**
     * The slug of the tenant
     */
      tenant?: any;
      body: CreateTemplateDto
    },
    context?: HttpContext
): Observable<StrictHttpResponse<TemplateResDto>> {
    const rb = new RequestBuilder(this.rootUrl, TemplateApiClient.TemplateControllerCreateTemplatePath, 'post');
    if (params) {
      rb.path('tenant', params['tenant'] ?? this.tenantResolver.resolve().slug, {});
      rb.body(params.body, 'application/json');
    }

    return this.http.request(
      rb.build({ responseType: 'json', accept: 'application/json', context })
    ).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<TemplateResDto>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `templateControllerCreateTemplate$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  templateControllerCreateTemplate(
    params: {

    /**
     * The slug of the tenant
     */
      tenant?: any;
      body: CreateTemplateDto
    },
    context?: HttpContext
): Observable<TemplateResDto> {
    return this.templateControllerCreateTemplate$Response(params, context).pipe(
      map((r: StrictHttpResponse<TemplateResDto>): TemplateResDto => r.body)
    );
  }

  /** Path part for operation `templateControllerFindOneTemplateById()` */
  static readonly TemplateControllerFindOneTemplateByIdPath = '/{tenant}/template/id/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `templateControllerFindOneTemplateById()` instead.
   *
   * This method doesn't expect any request body.
   */
  templateControllerFindOneTemplateById$Response(
    params: {
      id: number;

    /**
     * The slug of the tenant
     */
      tenant?: any;
    },
    context?: HttpContext
): Observable<StrictHttpResponse<TemplateResDto>> {
    const rb = new RequestBuilder(this.rootUrl, TemplateApiClient.TemplateControllerFindOneTemplateByIdPath, 'get');
    if (params) {
      rb.path('id', params.id, {});
      rb.path('tenant', params['tenant'] ?? this.tenantResolver.resolve().slug, {});
    }

    return this.http.request(
      rb.build({ responseType: 'json', accept: 'application/json', context })
    ).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<TemplateResDto>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `templateControllerFindOneTemplateById$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  templateControllerFindOneTemplateById(
    params: {
      id: number;

    /**
     * The slug of the tenant
     */
      tenant?: any;
    },
    context?: HttpContext
): Observable<TemplateResDto> {
    return this.templateControllerFindOneTemplateById$Response(params, context).pipe(
      map((r: StrictHttpResponse<TemplateResDto>): TemplateResDto => r.body)
    );
  }

  /** Path part for operation `templateControllerUpdateTemplate()` */
  static readonly TemplateControllerUpdateTemplatePath = '/{tenant}/template/id/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `templateControllerUpdateTemplate()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  templateControllerUpdateTemplate$Response(
    params: {
      id: number;

    /**
     * The slug of the tenant
     */
      tenant?: any;
      body: UpdateTemplateDto
    },
    context?: HttpContext
): Observable<StrictHttpResponse<TemplateResDto>> {
    const rb = new RequestBuilder(this.rootUrl, TemplateApiClient.TemplateControllerUpdateTemplatePath, 'patch');
    if (params) {
      rb.path('id', params.id, {});
      rb.path('tenant', params['tenant'] ?? this.tenantResolver.resolve().slug, {});
      rb.body(params.body, 'application/json');
    }

    return this.http.request(
      rb.build({ responseType: 'json', accept: 'application/json', context })
    ).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<TemplateResDto>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `templateControllerUpdateTemplate$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  templateControllerUpdateTemplate(
    params: {
      id: number;

    /**
     * The slug of the tenant
     */
      tenant?: any;
      body: UpdateTemplateDto
    },
    context?: HttpContext
): Observable<TemplateResDto> {
    return this.templateControllerUpdateTemplate$Response(params, context).pipe(
      map((r: StrictHttpResponse<TemplateResDto>): TemplateResDto => r.body)
    );
  }

}
