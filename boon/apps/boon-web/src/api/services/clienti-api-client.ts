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

import { ClienteResDto } from '../models/cliente-res-dto';
import { ClienteResExcerptDto } from '../models/cliente-res-excerpt-dto';
import { CreateClienteDto } from '../models/create-cliente-dto';
import { PaginatedResponseDto } from '../models/paginated-response-dto';
import { UpdateClienteDto } from '../models/update-cliente-dto';

@Injectable({ providedIn: 'root' })
export class ClientiApiClient extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient, private readonly tenantResolver: ActiveTenantResolver,
) {
    super(config, http);
  }

  /** Path part for operation `clientiControllerFindClienti()` */
  static readonly ClientiControllerFindClientiPath = '/admin/clienti';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `clientiControllerFindClienti()` instead.
   *
   * This method doesn't expect any request body.
   */
  clientiControllerFindClienti$Response(
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
      'filter.ragioneSociale'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.partitaIva'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.codiceFiscale'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.codiceSdi'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.pec'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.indirizzo'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.cap'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.telefono'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.eMail'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.web'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.flagInterno'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.luogo.codice'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.tenant.slug'?: any;
    },
    context?: HttpContext
): Observable<StrictHttpResponse<PaginatedResponseDto & {
'data'?: Array<ClienteResExcerptDto>;
}>> {
    const rb = new RequestBuilder(this.rootUrl, ClientiApiClient.ClientiControllerFindClientiPath, 'get');
    if (params) {
      rb.query('page', params.page, {});
      rb.query('limit', params.limit, {});
      rb.query('search', params.search, {});
      rb.query('searchBy', params.searchBy, {});
      rb.query('sortBy', params.sortBy, {});
      rb.query('filter.id', params['filter.id'], {});
      rb.query('filter.ragioneSociale', params['filter.ragioneSociale'], {});
      rb.query('filter.partitaIva', params['filter.partitaIva'], {});
      rb.query('filter.codiceFiscale', params['filter.codiceFiscale'], {});
      rb.query('filter.codiceSdi', params['filter.codiceSdi'], {});
      rb.query('filter.pec', params['filter.pec'], {});
      rb.query('filter.indirizzo', params['filter.indirizzo'], {});
      rb.query('filter.cap', params['filter.cap'], {});
      rb.query('filter.telefono', params['filter.telefono'], {});
      rb.query('filter.eMail', params['filter.eMail'], {});
      rb.query('filter.web', params['filter.web'], {});
      rb.query('filter.flagInterno', params['filter.flagInterno'], {});
      rb.query('filter.luogo.codice', params['filter.luogo.codice'], {});
      rb.query('filter.tenant.slug', params['filter.tenant.slug'], {});
    }

    return this.http.request(
      rb.build({ responseType: 'json', accept: 'application/json', context })
    ).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<PaginatedResponseDto & {
        'data'?: Array<ClienteResExcerptDto>;
        }>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `clientiControllerFindClienti$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  clientiControllerFindClienti(
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
      'filter.ragioneSociale'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.partitaIva'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.codiceFiscale'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.codiceSdi'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.pec'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.indirizzo'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.cap'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.telefono'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.eMail'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.web'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.flagInterno'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.luogo.codice'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.tenant.slug'?: any;
    },
    context?: HttpContext
): Observable<PaginatedResponseDto & {
'data'?: Array<ClienteResExcerptDto>;
}> {
    return this.clientiControllerFindClienti$Response(params, context).pipe(
      map((r: StrictHttpResponse<PaginatedResponseDto & {
'data'?: Array<ClienteResExcerptDto>;
}>): PaginatedResponseDto & {
'data'?: Array<ClienteResExcerptDto>;
} => r.body)
    );
  }

  /** Path part for operation `clientiControllerCreateCliente()` */
  static readonly ClientiControllerCreateClientePath = '/admin/clienti';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `clientiControllerCreateCliente()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  clientiControllerCreateCliente$Response(
    params: {
      body: CreateClienteDto
    },
    context?: HttpContext
): Observable<StrictHttpResponse<ClienteResDto>> {
    const rb = new RequestBuilder(this.rootUrl, ClientiApiClient.ClientiControllerCreateClientePath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(
      rb.build({ responseType: 'json', accept: 'application/json', context })
    ).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ClienteResDto>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `clientiControllerCreateCliente$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  clientiControllerCreateCliente(
    params: {
      body: CreateClienteDto
    },
    context?: HttpContext
): Observable<ClienteResDto> {
    return this.clientiControllerCreateCliente$Response(params, context).pipe(
      map((r: StrictHttpResponse<ClienteResDto>): ClienteResDto => r.body)
    );
  }

  /** Path part for operation `clientiControllerGetOneClienteById()` */
  static readonly ClientiControllerGetOneClienteByIdPath = '/admin/clienti/id/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `clientiControllerGetOneClienteById()` instead.
   *
   * This method doesn't expect any request body.
   */
  clientiControllerGetOneClienteById$Response(
    params: {
      id: number;
    },
    context?: HttpContext
): Observable<StrictHttpResponse<ClienteResDto>> {
    const rb = new RequestBuilder(this.rootUrl, ClientiApiClient.ClientiControllerGetOneClienteByIdPath, 'get');
    if (params) {
      rb.path('id', params.id, {});
    }

    return this.http.request(
      rb.build({ responseType: 'json', accept: 'application/json', context })
    ).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ClienteResDto>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `clientiControllerGetOneClienteById$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  clientiControllerGetOneClienteById(
    params: {
      id: number;
    },
    context?: HttpContext
): Observable<ClienteResDto> {
    return this.clientiControllerGetOneClienteById$Response(params, context).pipe(
      map((r: StrictHttpResponse<ClienteResDto>): ClienteResDto => r.body)
    );
  }

  /** Path part for operation `clientiControllerUpdateCliente()` */
  static readonly ClientiControllerUpdateClientePath = '/admin/clienti/id/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `clientiControllerUpdateCliente()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  clientiControllerUpdateCliente$Response(
    params: {
      id: number;
      body: UpdateClienteDto
    },
    context?: HttpContext
): Observable<StrictHttpResponse<ClienteResDto>> {
    const rb = new RequestBuilder(this.rootUrl, ClientiApiClient.ClientiControllerUpdateClientePath, 'patch');
    if (params) {
      rb.path('id', params.id, {});
      rb.body(params.body, 'application/json');
    }

    return this.http.request(
      rb.build({ responseType: 'json', accept: 'application/json', context })
    ).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ClienteResDto>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `clientiControllerUpdateCliente$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  clientiControllerUpdateCliente(
    params: {
      id: number;
      body: UpdateClienteDto
    },
    context?: HttpContext
): Observable<ClienteResDto> {
    return this.clientiControllerUpdateCliente$Response(params, context).pipe(
      map((r: StrictHttpResponse<ClienteResDto>): ClienteResDto => r.body)
    );
  }

}
