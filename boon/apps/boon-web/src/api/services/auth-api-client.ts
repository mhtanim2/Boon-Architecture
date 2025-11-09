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

import { LoginWithCredentialsBodyDto } from '../models/login-with-credentials-body-dto';
import { LoginWithMagicLinkBodyDto } from '../models/login-with-magic-link-body-dto';
import { LoginWithMagicLinkResBodyDto } from '../models/login-with-magic-link-res-body-dto';
import { SetMyPasswordDto } from '../models/set-my-password-dto';
import { UserMeResDto } from '../models/user-me-res-dto';

@Injectable({ providedIn: 'root' })
export class AuthApiClient extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient, private readonly tenantResolver: ActiveTenantResolver,
) {
    super(config, http);
  }

  /** Path part for operation `authControllerLogIn()` */
  static readonly AuthControllerLogInPath = '/auth/login';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `authControllerLogIn()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  authControllerLogIn$Response(
    params: {
      body: LoginWithCredentialsBodyDto
    },
    context?: HttpContext
): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, AuthApiClient.AuthControllerLogInPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
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
   * To access the full response (for headers, for example), `authControllerLogIn$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  authControllerLogIn(
    params: {
      body: LoginWithCredentialsBodyDto
    },
    context?: HttpContext
): Observable<void> {
    return this.authControllerLogIn$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  /** Path part for operation `authControllerLogInOnTenant()` */
  static readonly AuthControllerLogInOnTenantPath = '/auth/login/{tenant}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `authControllerLogInOnTenant()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  authControllerLogInOnTenant$Response(
    params: {

    /**
     * The slug of the tenant
     */
      tenant?: any;
      body: LoginWithCredentialsBodyDto
    },
    context?: HttpContext
): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, AuthApiClient.AuthControllerLogInOnTenantPath, 'post');
    if (params) {
      rb.path('tenant', params['tenant'] ?? this.tenantResolver.resolve().slug, {});
      rb.body(params.body, 'application/json');
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
   * To access the full response (for headers, for example), `authControllerLogInOnTenant$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  authControllerLogInOnTenant(
    params: {

    /**
     * The slug of the tenant
     */
      tenant?: any;
      body: LoginWithCredentialsBodyDto
    },
    context?: HttpContext
): Observable<void> {
    return this.authControllerLogInOnTenant$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  /** Path part for operation `authControllerRefresh()` */
  static readonly AuthControllerRefreshPath = '/auth/refresh';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `authControllerRefresh()` instead.
   *
   * This method doesn't expect any request body.
   */
  authControllerRefresh$Response(
    params?: {
    },
    context?: HttpContext
): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, AuthApiClient.AuthControllerRefreshPath, 'post');
    if (params) {
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
   * To access the full response (for headers, for example), `authControllerRefresh$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  authControllerRefresh(
    params?: {
    },
    context?: HttpContext
): Observable<void> {
    return this.authControllerRefresh$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  /** Path part for operation `authControllerLogOut()` */
  static readonly AuthControllerLogOutPath = '/auth/logout';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `authControllerLogOut()` instead.
   *
   * This method doesn't expect any request body.
   */
  authControllerLogOut$Response(
    params?: {
    },
    context?: HttpContext
): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, AuthApiClient.AuthControllerLogOutPath, 'post');
    if (params) {
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
   * To access the full response (for headers, for example), `authControllerLogOut$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  authControllerLogOut(
    params?: {
    },
    context?: HttpContext
): Observable<void> {
    return this.authControllerLogOut$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  /** Path part for operation `authControllerMagicLogIn()` */
  static readonly AuthControllerMagicLogInPath = '/auth/magic-login';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `authControllerMagicLogIn()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  authControllerMagicLogIn$Response(
    params: {
      action?: 'WELCOME' | 'RESET_PASSWORD' | 'VERIFY_EMAIL';
      body: LoginWithMagicLinkBodyDto
    },
    context?: HttpContext
): Observable<StrictHttpResponse<LoginWithMagicLinkResBodyDto>> {
    const rb = new RequestBuilder(this.rootUrl, AuthApiClient.AuthControllerMagicLogInPath, 'post');
    if (params) {
      rb.query('action', params.action, {});
      rb.body(params.body, 'application/json');
    }

    return this.http.request(
      rb.build({ responseType: 'json', accept: 'application/json', context })
    ).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<LoginWithMagicLinkResBodyDto>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `authControllerMagicLogIn$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  authControllerMagicLogIn(
    params: {
      action?: 'WELCOME' | 'RESET_PASSWORD' | 'VERIFY_EMAIL';
      body: LoginWithMagicLinkBodyDto
    },
    context?: HttpContext
): Observable<LoginWithMagicLinkResBodyDto> {
    return this.authControllerMagicLogIn$Response(params, context).pipe(
      map((r: StrictHttpResponse<LoginWithMagicLinkResBodyDto>): LoginWithMagicLinkResBodyDto => r.body)
    );
  }

  /** Path part for operation `authControllerMagicLogInCallback()` */
  static readonly AuthControllerMagicLogInCallbackPath = '/auth/magic-login/callback';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `authControllerMagicLogInCallback()` instead.
   *
   * This method doesn't expect any request body.
   */
  authControllerMagicLogInCallback$Response(
    params: {
      action?: 'WELCOME' | 'RESET_PASSWORD' | 'VERIFY_EMAIL';
      token: string;
    },
    context?: HttpContext
): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, AuthApiClient.AuthControllerMagicLogInCallbackPath, 'get');
    if (params) {
      rb.query('action', params.action, {});
      rb.query('token', params.token, {});
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
   * To access the full response (for headers, for example), `authControllerMagicLogInCallback$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  authControllerMagicLogInCallback(
    params: {
      action?: 'WELCOME' | 'RESET_PASSWORD' | 'VERIFY_EMAIL';
      token: string;
    },
    context?: HttpContext
): Observable<void> {
    return this.authControllerMagicLogInCallback$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  /** Path part for operation `usersMeControllerGetMe()` */
  static readonly UsersMeControllerGetMePath = '/auth/users/me';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `usersMeControllerGetMe()` instead.
   *
   * This method doesn't expect any request body.
   */
  usersMeControllerGetMe$Response(
    params?: {
    },
    context?: HttpContext
): Observable<StrictHttpResponse<UserMeResDto>> {
    const rb = new RequestBuilder(this.rootUrl, AuthApiClient.UsersMeControllerGetMePath, 'post');
    if (params) {
    }

    return this.http.request(
      rb.build({ responseType: 'json', accept: 'application/json', context })
    ).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<UserMeResDto>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `usersMeControllerGetMe$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  usersMeControllerGetMe(
    params?: {
    },
    context?: HttpContext
): Observable<UserMeResDto> {
    return this.usersMeControllerGetMe$Response(params, context).pipe(
      map((r: StrictHttpResponse<UserMeResDto>): UserMeResDto => r.body)
    );
  }

  /** Path part for operation `usersMeControllerSetMyPassword()` */
  static readonly UsersMeControllerSetMyPasswordPath = '/auth/users/me/password';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `usersMeControllerSetMyPassword()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  usersMeControllerSetMyPassword$Response(
    params: {
      body: SetMyPasswordDto
    },
    context?: HttpContext
): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, AuthApiClient.UsersMeControllerSetMyPasswordPath, 'put');
    if (params) {
      rb.body(params.body, 'application/json');
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
   * To access the full response (for headers, for example), `usersMeControllerSetMyPassword$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  usersMeControllerSetMyPassword(
    params: {
      body: SetMyPasswordDto
    },
    context?: HttpContext
): Observable<void> {
    return this.usersMeControllerSetMyPassword$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

}
