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

import { FunzionalitaResDto } from '../models/funzionalita-res-dto';
import { LivelliPrivilegiResExcerptDto } from '../models/livelli-privilegi-res-excerpt-dto';
import { PaginatedResponseDto } from '../models/paginated-response-dto';
import { PrivilegiByRuoloResExcerptDto } from '../models/privilegi-by-ruolo-res-excerpt-dto';
import { RuoloResExcerptDto } from '../models/ruolo-res-excerpt-dto';
import { TenantClienteResDto } from '../models/tenant-cliente-res-dto';
import { TenantResDto } from '../models/tenant-res-dto';

@Injectable({ providedIn: 'root' })
export class TenantsApiClient extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient, private readonly tenantResolver: ActiveTenantResolver,
) {
    super(config, http);
  }

  /** Path part for operation `tenantsControllerGetTenantInfo()` */
  static readonly TenantsControllerGetTenantInfoPath = '/{tenant}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `tenantsControllerGetTenantInfo()` instead.
   *
   * This method doesn't expect any request body.
   */
  tenantsControllerGetTenantInfo$Response(
    params: {

    /**
     * The slug of the tenant
     */
      tenant?: any;
    },
    context?: HttpContext
): Observable<StrictHttpResponse<TenantResDto>> {
    const rb = new RequestBuilder(this.rootUrl, TenantsApiClient.TenantsControllerGetTenantInfoPath, 'get');
    if (params) {
      rb.path('tenant', params['tenant'] ?? this.tenantResolver.resolve().slug, {});
    }

    return this.http.request(
      rb.build({ responseType: 'json', accept: 'application/json', context })
    ).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<TenantResDto>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `tenantsControllerGetTenantInfo$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  tenantsControllerGetTenantInfo(
    params: {

    /**
     * The slug of the tenant
     */
      tenant?: any;
    },
    context?: HttpContext
): Observable<TenantResDto> {
    return this.tenantsControllerGetTenantInfo$Response(params, context).pipe(
      map((r: StrictHttpResponse<TenantResDto>): TenantResDto => r.body)
    );
  }

  /** Path part for operation `tenantsControllerGetClienti()` */
  static readonly TenantsControllerGetClientiPath = '/{tenant}/clienti';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `tenantsControllerGetClienti()` instead.
   *
   * This method doesn't expect any request body.
   */
  tenantsControllerGetClienti$Response(
    params: {

    /**
     * The slug of the tenant
     */
      tenant?: any;
    },
    context?: HttpContext
): Observable<StrictHttpResponse<Array<TenantClienteResDto>>> {
    const rb = new RequestBuilder(this.rootUrl, TenantsApiClient.TenantsControllerGetClientiPath, 'get');
    if (params) {
      rb.path('tenant', params['tenant'] ?? this.tenantResolver.resolve().slug, {});
    }

    return this.http.request(
      rb.build({ responseType: 'json', accept: 'application/json', context })
    ).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<TenantClienteResDto>>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `tenantsControllerGetClienti$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  tenantsControllerGetClienti(
    params: {

    /**
     * The slug of the tenant
     */
      tenant?: any;
    },
    context?: HttpContext
): Observable<Array<TenantClienteResDto>> {
    return this.tenantsControllerGetClienti$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<TenantClienteResDto>>): Array<TenantClienteResDto> => r.body)
    );
  }

  /** Path part for operation `tenantsFeaturesControllerGetFunzionalita()` */
  static readonly TenantsFeaturesControllerGetFunzionalitaPath = '/{tenant}/features';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `tenantsFeaturesControllerGetFunzionalita()` instead.
   *
   * This method doesn't expect any request body.
   */
  tenantsFeaturesControllerGetFunzionalita$Response(
    params: {

    /**
     * The slug of the tenant
     */
      tenant?: any;
    },
    context?: HttpContext
): Observable<StrictHttpResponse<Array<FunzionalitaResDto>>> {
    const rb = new RequestBuilder(this.rootUrl, TenantsApiClient.TenantsFeaturesControllerGetFunzionalitaPath, 'get');
    if (params) {
      rb.path('tenant', params['tenant'] ?? this.tenantResolver.resolve().slug, {});
    }

    return this.http.request(
      rb.build({ responseType: 'json', accept: 'application/json', context })
    ).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<FunzionalitaResDto>>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `tenantsFeaturesControllerGetFunzionalita$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  tenantsFeaturesControllerGetFunzionalita(
    params: {

    /**
     * The slug of the tenant
     */
      tenant?: any;
    },
    context?: HttpContext
): Observable<Array<FunzionalitaResDto>> {
    return this.tenantsFeaturesControllerGetFunzionalita$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<FunzionalitaResDto>>): Array<FunzionalitaResDto> => r.body)
    );
  }

  /** Path part for operation `tenantsPrivilegesControllerGetPrivilegesByRoles()` */
  static readonly TenantsPrivilegesControllerGetPrivilegesByRolesPath = '/{tenant}/privileges';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `tenantsPrivilegesControllerGetPrivilegesByRoles()` instead.
   *
   * This method doesn't expect any request body.
   */
  tenantsPrivilegesControllerGetPrivilegesByRoles$Response(
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
      'filter.funzionalita.id'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.funzionalita.nome'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.ruolo.id'?: any;
    },
    context?: HttpContext
): Observable<StrictHttpResponse<Array<PrivilegiByRuoloResExcerptDto>>> {
    const rb = new RequestBuilder(this.rootUrl, TenantsApiClient.TenantsPrivilegesControllerGetPrivilegesByRolesPath, 'get');
    if (params) {
      rb.path('tenant', params['tenant'] ?? this.tenantResolver.resolve().slug, {});
      rb.query('page', params.page, {});
      rb.query('limit', params.limit, {});
      rb.query('search', params.search, {});
      rb.query('searchBy', params.searchBy, {});
      rb.query('sortBy', params.sortBy, {});
      rb.query('filter.funzionalita.id', params['filter.funzionalita.id'], {});
      rb.query('filter.funzionalita.nome', params['filter.funzionalita.nome'], {});
      rb.query('filter.ruolo.id', params['filter.ruolo.id'], {});
    }

    return this.http.request(
      rb.build({ responseType: 'json', accept: 'application/json', context })
    ).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<PrivilegiByRuoloResExcerptDto>>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `tenantsPrivilegesControllerGetPrivilegesByRoles$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  tenantsPrivilegesControllerGetPrivilegesByRoles(
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
      'filter.funzionalita.id'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.funzionalita.nome'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.ruolo.id'?: any;
    },
    context?: HttpContext
): Observable<Array<PrivilegiByRuoloResExcerptDto>> {
    return this.tenantsPrivilegesControllerGetPrivilegesByRoles$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<PrivilegiByRuoloResExcerptDto>>): Array<PrivilegiByRuoloResExcerptDto> => r.body)
    );
  }

  /** Path part for operation `tenantsPrivilegesControllerGetPermissionsLevels()` */
  static readonly TenantsPrivilegesControllerGetPermissionsLevelsPath = '/{tenant}/privileges/levels';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `tenantsPrivilegesControllerGetPermissionsLevels()` instead.
   *
   * This method doesn't expect any request body.
   */
  tenantsPrivilegesControllerGetPermissionsLevels$Response(
    params: {

    /**
     * The slug of the tenant
     */
      tenant?: any;
    },
    context?: HttpContext
): Observable<StrictHttpResponse<Array<LivelliPrivilegiResExcerptDto>>> {
    const rb = new RequestBuilder(this.rootUrl, TenantsApiClient.TenantsPrivilegesControllerGetPermissionsLevelsPath, 'get');
    if (params) {
      rb.path('tenant', params['tenant'] ?? this.tenantResolver.resolve().slug, {});
    }

    return this.http.request(
      rb.build({ responseType: 'json', accept: 'application/json', context })
    ).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<LivelliPrivilegiResExcerptDto>>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `tenantsPrivilegesControllerGetPermissionsLevels$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  tenantsPrivilegesControllerGetPermissionsLevels(
    params: {

    /**
     * The slug of the tenant
     */
      tenant?: any;
    },
    context?: HttpContext
): Observable<Array<LivelliPrivilegiResExcerptDto>> {
    return this.tenantsPrivilegesControllerGetPermissionsLevels$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<LivelliPrivilegiResExcerptDto>>): Array<LivelliPrivilegiResExcerptDto> => r.body)
    );
  }

  /** Path part for operation `tenantsRolesControllerFindTenantsRoles()` */
  static readonly TenantsRolesControllerFindTenantsRolesPath = '/{tenant}/roles';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `tenantsRolesControllerFindTenantsRoles()` instead.
   *
   * This method doesn't expect any request body.
   */
  tenantsRolesControllerFindTenantsRoles$Response(
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
'data'?: Array<RuoloResExcerptDto>;
}>> {
    const rb = new RequestBuilder(this.rootUrl, TenantsApiClient.TenantsRolesControllerFindTenantsRolesPath, 'get');
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
        'data'?: Array<RuoloResExcerptDto>;
        }>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `tenantsRolesControllerFindTenantsRoles$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  tenantsRolesControllerFindTenantsRoles(
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
'data'?: Array<RuoloResExcerptDto>;
}> {
    return this.tenantsRolesControllerFindTenantsRoles$Response(params, context).pipe(
      map((r: StrictHttpResponse<PaginatedResponseDto & {
'data'?: Array<RuoloResExcerptDto>;
}>): PaginatedResponseDto & {
'data'?: Array<RuoloResExcerptDto>;
} => r.body)
    );
  }

  /** Path part for operation `tenantsRolesControllerFindOneRuoloById()` */
  static readonly TenantsRolesControllerFindOneRuoloByIdPath = '/{tenant}/roles/id/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `tenantsRolesControllerFindOneRuoloById()` instead.
   *
   * This method doesn't expect any request body.
   */
  tenantsRolesControllerFindOneRuoloById$Response(
    params: {
      id: number;

    /**
     * The slug of the tenant
     */
      tenant?: any;
    },
    context?: HttpContext
): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, TenantsApiClient.TenantsRolesControllerFindOneRuoloByIdPath, 'get');
    if (params) {
      rb.path('id', params.id, {});
      rb.path('tenant', params['tenant'] ?? this.tenantResolver.resolve().slug, {});
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
   * To access the full response (for headers, for example), `tenantsRolesControllerFindOneRuoloById$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  tenantsRolesControllerFindOneRuoloById(
    params: {
      id: number;

    /**
     * The slug of the tenant
     */
      tenant?: any;
    },
    context?: HttpContext
): Observable<void> {
    return this.tenantsRolesControllerFindOneRuoloById$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

}
