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

import { BulkImportArticoliDto } from '../models/bulk-import-articoli-dto';
import { FileUploadResDto } from '../models/file-upload-res-dto';

@Injectable({ providedIn: 'root' })
export class ArticoliApiClient extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient, private readonly tenantResolver: ActiveTenantResolver,
) {
    super(config, http);
  }

  /** Path part for operation `articoliControllerBulkImportArticoli()` */
  static readonly ArticoliControllerBulkImportArticoliPath = '/{tenant}/articoli/bulk-import';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `articoliControllerBulkImportArticoli()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  articoliControllerBulkImportArticoli$Response(
    params: {

    /**
     * The slug of the tenant
     */
      tenant?: any;
      body: BulkImportArticoliDto
    },
    context?: HttpContext
): Observable<StrictHttpResponse<FileUploadResDto>> {
    const rb = new RequestBuilder(this.rootUrl, ArticoliApiClient.ArticoliControllerBulkImportArticoliPath, 'post');
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
   * To access the full response (for headers, for example), `articoliControllerBulkImportArticoli$Response()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  articoliControllerBulkImportArticoli(
    params: {

    /**
     * The slug of the tenant
     */
      tenant?: any;
      body: BulkImportArticoliDto
    },
    context?: HttpContext
): Observable<FileUploadResDto> {
    return this.articoliControllerBulkImportArticoli$Response(params, context).pipe(
      map((r: StrictHttpResponse<FileUploadResDto>): FileUploadResDto => r.body)
    );
  }

}
