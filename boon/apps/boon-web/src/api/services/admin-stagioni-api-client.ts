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

import { CreateStagioneClienteDto } from '../models/create-stagione-cliente-dto';
import { PaginatedResponseDto } from '../models/paginated-response-dto';
import { StagioneClienteResDto } from '../models/stagione-cliente-res-dto';
import { StagioneClienteResExcerptDto } from '../models/stagione-cliente-res-excerpt-dto';
import { StagioneResDto } from '../models/stagione-res-dto';
import { StagioneResExcerptDto } from '../models/stagione-res-excerpt-dto';
import { UpdateStagioneClienteDto } from '../models/update-stagione-cliente-dto';
import { UpdateStagioneDto } from '../models/update-stagione-dto';

@Injectable({ providedIn: 'root' })
export class AdminStagioniApiClient extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient, private readonly tenantResolver: ActiveTenantResolver,
) {
    super(config, http);
  }

  /** Path part for operation `stagioniClientiControllerFindStagioniClienti()` */
  static readonly StagioniClientiControllerFindStagioniClientiPath = '/{tenant}/stagioni';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `stagioniClientiControllerFindStagioniClienti()` instead.
   *
   * This method doesn't expect any request body.
   */
  stagioniClientiControllerFindStagioniClienti$Response(
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
      'filter.nome'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.descrizione'?: any;
    },
    context?: HttpContext
): Observable<StrictHttpResponse<PaginatedResponseDto & {
'data'?: Array<StagioneClienteResExcerptDto>;
}>> {
    const rb = new RequestBuilder(this.rootUrl, AdminStagioniApiClient.StagioniClientiControllerFindStagioniClientiPath, 'get');
    if (params) {
      rb.path('tenant', params['tenant'] ?? this.tenantResolver.resolve().slug, {});
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
        'data'?: Array<StagioneClienteResExcerptDto>;
        }>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `stagioniClientiControllerFindStagioniClienti$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  stagioniClientiControllerFindStagioniClienti(
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
      'filter.nome'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.descrizione'?: any;
    },
    context?: HttpContext
): Observable<PaginatedResponseDto & {
'data'?: Array<StagioneClienteResExcerptDto>;
}> {
    return this.stagioniClientiControllerFindStagioniClienti$Response(params, context).pipe(
      map((r: StrictHttpResponse<PaginatedResponseDto & {
'data'?: Array<StagioneClienteResExcerptDto>;
}>): PaginatedResponseDto & {
'data'?: Array<StagioneClienteResExcerptDto>;
} => r.body)
    );
  }

  /** Path part for operation `stagioniClientiControllerCreateStagioneCliente()` */
  static readonly StagioniClientiControllerCreateStagioneClientePath = '/{tenant}/stagioni';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `stagioniClientiControllerCreateStagioneCliente()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  stagioniClientiControllerCreateStagioneCliente$Response(
    params: {

    /**
     * The slug of the tenant
     */
      tenant?: any;
      body: CreateStagioneClienteDto
    },
    context?: HttpContext
): Observable<StrictHttpResponse<StagioneClienteResDto>> {
    const rb = new RequestBuilder(this.rootUrl, AdminStagioniApiClient.StagioniClientiControllerCreateStagioneClientePath, 'post');
    if (params) {
      rb.path('tenant', params['tenant'] ?? this.tenantResolver.resolve().slug, {});
      rb.body(params.body, 'application/json');
    }

    return this.http.request(
      rb.build({ responseType: 'json', accept: 'application/json', context })
    ).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<StagioneClienteResDto>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `stagioniClientiControllerCreateStagioneCliente$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  stagioniClientiControllerCreateStagioneCliente(
    params: {

    /**
     * The slug of the tenant
     */
      tenant?: any;
      body: CreateStagioneClienteDto
    },
    context?: HttpContext
): Observable<StagioneClienteResDto> {
    return this.stagioniClientiControllerCreateStagioneCliente$Response(params, context).pipe(
      map((r: StrictHttpResponse<StagioneClienteResDto>): StagioneClienteResDto => r.body)
    );
  }

  /** Path part for operation `stagioniClientiControllerFindOneStagioneClienteById()` */
  static readonly StagioniClientiControllerFindOneStagioneClienteByIdPath = '/{tenant}/stagioni/id/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `stagioniClientiControllerFindOneStagioneClienteById()` instead.
   *
   * This method doesn't expect any request body.
   */
  stagioniClientiControllerFindOneStagioneClienteById$Response(
    params: {
      id: number;

    /**
     * The slug of the tenant
     */
      tenant?: any;
    },
    context?: HttpContext
): Observable<StrictHttpResponse<StagioneClienteResDto>> {
    const rb = new RequestBuilder(this.rootUrl, AdminStagioniApiClient.StagioniClientiControllerFindOneStagioneClienteByIdPath, 'get');
    if (params) {
      rb.path('id', params.id, {});
      rb.path('tenant', params['tenant'] ?? this.tenantResolver.resolve().slug, {});
    }

    return this.http.request(
      rb.build({ responseType: 'json', accept: 'application/json', context })
    ).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<StagioneClienteResDto>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `stagioniClientiControllerFindOneStagioneClienteById$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  stagioniClientiControllerFindOneStagioneClienteById(
    params: {
      id: number;

    /**
     * The slug of the tenant
     */
      tenant?: any;
    },
    context?: HttpContext
): Observable<StagioneClienteResDto> {
    return this.stagioniClientiControllerFindOneStagioneClienteById$Response(params, context).pipe(
      map((r: StrictHttpResponse<StagioneClienteResDto>): StagioneClienteResDto => r.body)
    );
  }

  /** Path part for operation `stagioniClientiControllerUpdateStagioneCliente()` */
  static readonly StagioniClientiControllerUpdateStagioneClientePath = '/{tenant}/stagioni/id/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `stagioniClientiControllerUpdateStagioneCliente()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  stagioniClientiControllerUpdateStagioneCliente$Response(
    params: {
      id: number;

    /**
     * The slug of the tenant
     */
      tenant?: any;
      body: UpdateStagioneClienteDto
    },
    context?: HttpContext
): Observable<StrictHttpResponse<StagioneClienteResDto>> {
    const rb = new RequestBuilder(this.rootUrl, AdminStagioniApiClient.StagioniClientiControllerUpdateStagioneClientePath, 'patch');
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
        return r as StrictHttpResponse<StagioneClienteResDto>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `stagioniClientiControllerUpdateStagioneCliente$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  stagioniClientiControllerUpdateStagioneCliente(
    params: {
      id: number;

    /**
     * The slug of the tenant
     */
      tenant?: any;
      body: UpdateStagioneClienteDto
    },
    context?: HttpContext
): Observable<StagioneClienteResDto> {
    return this.stagioniClientiControllerUpdateStagioneCliente$Response(params, context).pipe(
      map((r: StrictHttpResponse<StagioneClienteResDto>): StagioneClienteResDto => r.body)
    );
  }

  /** Path part for operation `stagioniControllerFindStagioni()` */
  static readonly StagioniControllerFindStagioniPath = '/admin/stagioni';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `stagioniControllerFindStagioni()` instead.
   *
   * This method doesn't expect any request body.
   */
  stagioniControllerFindStagioni$Response(
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
'data'?: Array<StagioneResExcerptDto>;
}>> {
    const rb = new RequestBuilder(this.rootUrl, AdminStagioniApiClient.StagioniControllerFindStagioniPath, 'get');
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
        'data'?: Array<StagioneResExcerptDto>;
        }>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `stagioniControllerFindStagioni$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  stagioniControllerFindStagioni(
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
'data'?: Array<StagioneResExcerptDto>;
}> {
    return this.stagioniControllerFindStagioni$Response(params, context).pipe(
      map((r: StrictHttpResponse<PaginatedResponseDto & {
'data'?: Array<StagioneResExcerptDto>;
}>): PaginatedResponseDto & {
'data'?: Array<StagioneResExcerptDto>;
} => r.body)
    );
  }

  /** Path part for operation `stagioniControllerFindOneStagioneById()` */
  static readonly StagioniControllerFindOneStagioneByIdPath = '/admin/stagioni/id/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `stagioniControllerFindOneStagioneById()` instead.
   *
   * This method doesn't expect any request body.
   */
  stagioniControllerFindOneStagioneById$Response(
    params: {
      id: number;
    },
    context?: HttpContext
): Observable<StrictHttpResponse<StagioneResDto>> {
    const rb = new RequestBuilder(this.rootUrl, AdminStagioniApiClient.StagioniControllerFindOneStagioneByIdPath, 'get');
    if (params) {
      rb.path('id', params.id, {});
    }

    return this.http.request(
      rb.build({ responseType: 'json', accept: 'application/json', context })
    ).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<StagioneResDto>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `stagioniControllerFindOneStagioneById$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  stagioniControllerFindOneStagioneById(
    params: {
      id: number;
    },
    context?: HttpContext
): Observable<StagioneResDto> {
    return this.stagioniControllerFindOneStagioneById$Response(params, context).pipe(
      map((r: StrictHttpResponse<StagioneResDto>): StagioneResDto => r.body)
    );
  }

  /** Path part for operation `stagioniControllerUpdateStagione()` */
  static readonly StagioniControllerUpdateStagionePath = '/admin/stagioni/id/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `stagioniControllerUpdateStagione()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  stagioniControllerUpdateStagione$Response(
    params: {
      id: number;
      body: UpdateStagioneDto
    },
    context?: HttpContext
): Observable<StrictHttpResponse<StagioneResDto>> {
    const rb = new RequestBuilder(this.rootUrl, AdminStagioniApiClient.StagioniControllerUpdateStagionePath, 'patch');
    if (params) {
      rb.path('id', params.id, {});
      rb.body(params.body, 'application/json');
    }

    return this.http.request(
      rb.build({ responseType: 'json', accept: 'application/json', context })
    ).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<StagioneResDto>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `stagioniControllerUpdateStagione$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  stagioniControllerUpdateStagione(
    params: {
      id: number;
      body: UpdateStagioneDto
    },
    context?: HttpContext
): Observable<StagioneResDto> {
    return this.stagioniControllerUpdateStagione$Response(params, context).pipe(
      map((r: StrictHttpResponse<StagioneResDto>): StagioneResDto => r.body)
    );
  }

}
