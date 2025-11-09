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


@Injectable({ providedIn: 'root' })
export class StorageApiClient extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient, private readonly tenantResolver: ActiveTenantResolver,
) {
    super(config, http);
  }

  /** Path part for operation `storageControllerGetPublicObject()` */
  static readonly StorageControllerGetPublicObjectPath = '/storage/public/{wildcard}';

  /**
   * Retrieves an object.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `storageControllerGetPublicObject()` instead.
   *
   * This method doesn't expect any request body.
   */
  storageControllerGetPublicObject$Response(
    params: {
      wildcard: string;
    },
    context?: HttpContext
): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, StorageApiClient.StorageControllerGetPublicObjectPath, 'get');
    if (params) {
      rb.path('wildcard', params.wildcard, {});
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
   * Retrieves an object.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `storageControllerGetPublicObject$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  storageControllerGetPublicObject(
    params: {
      wildcard: string;
    },
    context?: HttpContext
): Observable<void> {
    return this.storageControllerGetPublicObject$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  /** Path part for operation `storageControllerGetPrivateObject()` */
  static readonly StorageControllerGetPrivateObjectPath = '/storage/{wildcard}';

  /**
   * Retrieves an object.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `storageControllerGetPrivateObject()` instead.
   *
   * This method doesn't expect any request body.
   */
  storageControllerGetPrivateObject$Response(
    params: {
      wildcard: string;
    },
    context?: HttpContext
): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, StorageApiClient.StorageControllerGetPrivateObjectPath, 'get');
    if (params) {
      rb.path('wildcard', params.wildcard, {});
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
   * Retrieves an object.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `storageControllerGetPrivateObject$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  storageControllerGetPrivateObject(
    params: {
      wildcard: string;
    },
    context?: HttpContext
): Observable<void> {
    return this.storageControllerGetPrivateObject$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

}
