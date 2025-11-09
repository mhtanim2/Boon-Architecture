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

import { CreateFileUploadDto } from '../models/create-file-upload-dto';
import { FileUploadResDto } from '../models/file-upload-res-dto';
import { FileUploadResExcerptDto } from '../models/file-upload-res-excerpt-dto';
import { PaginatedResponseDto } from '../models/paginated-response-dto';
import { UpdateFileUploadDto } from '../models/update-file-upload-dto';

@Injectable({ providedIn: 'root' })
export class FileUploadsApiClient extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient, private readonly tenantResolver: ActiveTenantResolver,
) {
    super(config, http);
  }

  /** Path part for operation `fileUploadsControllerFindFileUploads()` */
  static readonly FileUploadsControllerFindFileUploadsPath = '/{tenant}/file-uploads';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `fileUploadsControllerFindFileUploads()` instead.
   *
   * This method doesn't expect any request body.
   */
  fileUploadsControllerFindFileUploads$Response(
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
      'filter.template.nome'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.uploader.username'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.template.funzionalita.id'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.dataOra'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.ultimaModifica'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.nomeFile'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.dimensione'?: any;
    },
    context?: HttpContext
): Observable<StrictHttpResponse<PaginatedResponseDto & {
'data'?: Array<FileUploadResExcerptDto>;
}>> {
    const rb = new RequestBuilder(this.rootUrl, FileUploadsApiClient.FileUploadsControllerFindFileUploadsPath, 'get');
    if (params) {
      rb.path('tenant', params['tenant'] ?? this.tenantResolver.resolve().slug, {});
      rb.query('page', params.page, {});
      rb.query('limit', params.limit, {});
      rb.query('search', params.search, {});
      rb.query('searchBy', params.searchBy, {});
      rb.query('sortBy', params.sortBy, {});
      rb.query('filter.id', params['filter.id'], {});
      rb.query('filter.template.nome', params['filter.template.nome'], {});
      rb.query('filter.uploader.username', params['filter.uploader.username'], {});
      rb.query('filter.template.funzionalita.id', params['filter.template.funzionalita.id'], {});
      rb.query('filter.dataOra', params['filter.dataOra'], {});
      rb.query('filter.ultimaModifica', params['filter.ultimaModifica'], {});
      rb.query('filter.nomeFile', params['filter.nomeFile'], {});
      rb.query('filter.dimensione', params['filter.dimensione'], {});
    }

    return this.http.request(
      rb.build({ responseType: 'json', accept: 'application/json', context })
    ).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<PaginatedResponseDto & {
        'data'?: Array<FileUploadResExcerptDto>;
        }>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `fileUploadsControllerFindFileUploads$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  fileUploadsControllerFindFileUploads(
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
      'filter.template.nome'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.uploader.username'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.template.funzionalita.id'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.dataOra'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.ultimaModifica'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.nomeFile'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.dimensione'?: any;
    },
    context?: HttpContext
): Observable<PaginatedResponseDto & {
'data'?: Array<FileUploadResExcerptDto>;
}> {
    return this.fileUploadsControllerFindFileUploads$Response(params, context).pipe(
      map((r: StrictHttpResponse<PaginatedResponseDto & {
'data'?: Array<FileUploadResExcerptDto>;
}>): PaginatedResponseDto & {
'data'?: Array<FileUploadResExcerptDto>;
} => r.body)
    );
  }

  /** Path part for operation `fileUploadsControllerCreateFileUpload()` */
  static readonly FileUploadsControllerCreateFileUploadPath = '/{tenant}/file-uploads';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `fileUploadsControllerCreateFileUpload()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  fileUploadsControllerCreateFileUpload$Response(
    params: {

    /**
     * The slug of the tenant
     */
      tenant?: any;
      body: CreateFileUploadDto
    },
    context?: HttpContext
): Observable<StrictHttpResponse<FileUploadResDto>> {
    const rb = new RequestBuilder(this.rootUrl, FileUploadsApiClient.FileUploadsControllerCreateFileUploadPath, 'post');
    if (params) {
      rb.path('tenant', params['tenant'] ?? this.tenantResolver.resolve().slug, {});
      rb.body(params.body, 'multipart/form-data');
    }

    return this.http.request(
      rb.build({ responseType: 'json', accept: 'application/json', context })
    ).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<FileUploadResDto>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `fileUploadsControllerCreateFileUpload$Response()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  fileUploadsControllerCreateFileUpload(
    params: {

    /**
     * The slug of the tenant
     */
      tenant?: any;
      body: CreateFileUploadDto
    },
    context?: HttpContext
): Observable<FileUploadResDto> {
    return this.fileUploadsControllerCreateFileUpload$Response(params, context).pipe(
      map((r: StrictHttpResponse<FileUploadResDto>): FileUploadResDto => r.body)
    );
  }

  /** Path part for operation `fileUploadsControllerFindOneFileUploadById()` */
  static readonly FileUploadsControllerFindOneFileUploadByIdPath = '/{tenant}/file-uploads/id/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `fileUploadsControllerFindOneFileUploadById()` instead.
   *
   * This method doesn't expect any request body.
   */
  fileUploadsControllerFindOneFileUploadById$Response(
    params: {
      id: number;

    /**
     * The slug of the tenant
     */
      tenant?: any;
    },
    context?: HttpContext
): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, FileUploadsApiClient.FileUploadsControllerFindOneFileUploadByIdPath, 'get');
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
   * To access the full response (for headers, for example), `fileUploadsControllerFindOneFileUploadById$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  fileUploadsControllerFindOneFileUploadById(
    params: {
      id: number;

    /**
     * The slug of the tenant
     */
      tenant?: any;
    },
    context?: HttpContext
): Observable<void> {
    return this.fileUploadsControllerFindOneFileUploadById$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  /** Path part for operation `fileUploadsControllerDeleteFileUpload()` */
  static readonly FileUploadsControllerDeleteFileUploadPath = '/{tenant}/file-uploads/id/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `fileUploadsControllerDeleteFileUpload()` instead.
   *
   * This method doesn't expect any request body.
   */
  fileUploadsControllerDeleteFileUpload$Response(
    params: {
      id: number;

    /**
     * The slug of the tenant
     */
      tenant?: any;
    },
    context?: HttpContext
): Observable<StrictHttpResponse<FileUploadResDto>> {
    const rb = new RequestBuilder(this.rootUrl, FileUploadsApiClient.FileUploadsControllerDeleteFileUploadPath, 'delete');
    if (params) {
      rb.path('id', params.id, {});
      rb.path('tenant', params['tenant'] ?? this.tenantResolver.resolve().slug, {});
    }

    return this.http.request(
      rb.build({ responseType: 'json', accept: 'application/json', context })
    ).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<FileUploadResDto>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `fileUploadsControllerDeleteFileUpload$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  fileUploadsControllerDeleteFileUpload(
    params: {
      id: number;

    /**
     * The slug of the tenant
     */
      tenant?: any;
    },
    context?: HttpContext
): Observable<FileUploadResDto> {
    return this.fileUploadsControllerDeleteFileUpload$Response(params, context).pipe(
      map((r: StrictHttpResponse<FileUploadResDto>): FileUploadResDto => r.body)
    );
  }

  /** Path part for operation `fileUploadsControllerUpdateFileUpload()` */
  static readonly FileUploadsControllerUpdateFileUploadPath = '/{tenant}/file-uploads/id/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `fileUploadsControllerUpdateFileUpload()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  fileUploadsControllerUpdateFileUpload$Response(
    params: {
      id: number;

    /**
     * The slug of the tenant
     */
      tenant?: any;
      body: UpdateFileUploadDto
    },
    context?: HttpContext
): Observable<StrictHttpResponse<FileUploadResDto>> {
    const rb = new RequestBuilder(this.rootUrl, FileUploadsApiClient.FileUploadsControllerUpdateFileUploadPath, 'patch');
    if (params) {
      rb.path('id', params.id, {});
      rb.path('tenant', params['tenant'] ?? this.tenantResolver.resolve().slug, {});
      rb.body(params.body, 'multipart/form-data');
    }

    return this.http.request(
      rb.build({ responseType: 'json', accept: 'application/json', context })
    ).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<FileUploadResDto>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `fileUploadsControllerUpdateFileUpload$Response()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  fileUploadsControllerUpdateFileUpload(
    params: {
      id: number;

    /**
     * The slug of the tenant
     */
      tenant?: any;
      body: UpdateFileUploadDto
    },
    context?: HttpContext
): Observable<FileUploadResDto> {
    return this.fileUploadsControllerUpdateFileUpload$Response(params, context).pipe(
      map((r: StrictHttpResponse<FileUploadResDto>): FileUploadResDto => r.body)
    );
  }

  /** Path part for operation `fileUploadsControllerDownloadOneFileUploadById()` */
  static readonly FileUploadsControllerDownloadOneFileUploadByIdPath = '/{tenant}/file-uploads/id/{id}/download';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `fileUploadsControllerDownloadOneFileUploadById()` instead.
   *
   * This method doesn't expect any request body.
   */
  fileUploadsControllerDownloadOneFileUploadById$Response(
    params: {
      id: number;

    /**
     * The slug of the tenant
     */
      tenant?: any;
    },
    context?: HttpContext
): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, FileUploadsApiClient.FileUploadsControllerDownloadOneFileUploadByIdPath, 'get');
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
   * To access the full response (for headers, for example), `fileUploadsControllerDownloadOneFileUploadById$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  fileUploadsControllerDownloadOneFileUploadById(
    params: {
      id: number;

    /**
     * The slug of the tenant
     */
      tenant?: any;
    },
    context?: HttpContext
): Observable<void> {
    return this.fileUploadsControllerDownloadOneFileUploadById$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

}
