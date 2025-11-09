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

import { CreateUserDto } from '../models/create-user-dto';
import { PaginatedResponseDto } from '../models/paginated-response-dto';
import { UpdateUserDto } from '../models/update-user-dto';
import { UserResDto } from '../models/user-res-dto';
import { UserResExcerptDto } from '../models/user-res-excerpt-dto';

@Injectable({ providedIn: 'root' })
export class UsersApiClient extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient, private readonly tenantResolver: ActiveTenantResolver,
) {
    super(config, http);
  }

  /** Path part for operation `usersControllerFindUsers()` */
  static readonly UsersControllerFindUsersPath = '/admin/users';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `usersControllerFindUsers()` instead.
   *
   * This method doesn't expect any request body.
   */
  usersControllerFindUsers$Response(
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
      'filter.cognome'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.nome'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.username'?: any;

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
      'filter.profili.ruolo.id'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.dataCreazione'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.dataScadenza'?: any;
    },
    context?: HttpContext
): Observable<StrictHttpResponse<PaginatedResponseDto & {
'data'?: Array<UserResExcerptDto>;
}>> {
    const rb = new RequestBuilder(this.rootUrl, UsersApiClient.UsersControllerFindUsersPath, 'get');
    if (params) {
      rb.query('page', params.page, {});
      rb.query('limit', params.limit, {});
      rb.query('search', params.search, {});
      rb.query('searchBy', params.searchBy, {});
      rb.query('sortBy', params.sortBy, {});
      rb.query('filter.id', params['filter.id'], {});
      rb.query('filter.cognome', params['filter.cognome'], {});
      rb.query('filter.nome', params['filter.nome'], {});
      rb.query('filter.username', params['filter.username'], {});
      rb.query('filter.cliente.id', params['filter.cliente.id'], {});
      rb.query('filter.stato.id', params['filter.stato.id'], {});
      rb.query('filter.profili.ruolo.id', params['filter.profili.ruolo.id'], {});
      rb.query('filter.dataCreazione', params['filter.dataCreazione'], {});
      rb.query('filter.dataScadenza', params['filter.dataScadenza'], {});
    }

    return this.http.request(
      rb.build({ responseType: 'json', accept: 'application/json', context })
    ).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<PaginatedResponseDto & {
        'data'?: Array<UserResExcerptDto>;
        }>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `usersControllerFindUsers$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  usersControllerFindUsers(
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
      'filter.cognome'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.nome'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.username'?: any;

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
      'filter.profili.ruolo.id'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.dataCreazione'?: any;

    /**
     * Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1
     */
      'filter.dataScadenza'?: any;
    },
    context?: HttpContext
): Observable<PaginatedResponseDto & {
'data'?: Array<UserResExcerptDto>;
}> {
    return this.usersControllerFindUsers$Response(params, context).pipe(
      map((r: StrictHttpResponse<PaginatedResponseDto & {
'data'?: Array<UserResExcerptDto>;
}>): PaginatedResponseDto & {
'data'?: Array<UserResExcerptDto>;
} => r.body)
    );
  }

  /** Path part for operation `usersControllerCreateUser()` */
  static readonly UsersControllerCreateUserPath = '/admin/users';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `usersControllerCreateUser()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  usersControllerCreateUser$Response(
    params: {
      body: CreateUserDto
    },
    context?: HttpContext
): Observable<StrictHttpResponse<UserResDto>> {
    const rb = new RequestBuilder(this.rootUrl, UsersApiClient.UsersControllerCreateUserPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(
      rb.build({ responseType: 'json', accept: 'application/json', context })
    ).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<UserResDto>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `usersControllerCreateUser$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  usersControllerCreateUser(
    params: {
      body: CreateUserDto
    },
    context?: HttpContext
): Observable<UserResDto> {
    return this.usersControllerCreateUser$Response(params, context).pipe(
      map((r: StrictHttpResponse<UserResDto>): UserResDto => r.body)
    );
  }

  /** Path part for operation `usersControllerFindOneUserById()` */
  static readonly UsersControllerFindOneUserByIdPath = '/admin/users/id/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `usersControllerFindOneUserById()` instead.
   *
   * This method doesn't expect any request body.
   */
  usersControllerFindOneUserById$Response(
    params: {
      id: number;
    },
    context?: HttpContext
): Observable<StrictHttpResponse<UserResDto>> {
    const rb = new RequestBuilder(this.rootUrl, UsersApiClient.UsersControllerFindOneUserByIdPath, 'get');
    if (params) {
      rb.path('id', params.id, {});
    }

    return this.http.request(
      rb.build({ responseType: 'json', accept: 'application/json', context })
    ).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<UserResDto>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `usersControllerFindOneUserById$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  usersControllerFindOneUserById(
    params: {
      id: number;
    },
    context?: HttpContext
): Observable<UserResDto> {
    return this.usersControllerFindOneUserById$Response(params, context).pipe(
      map((r: StrictHttpResponse<UserResDto>): UserResDto => r.body)
    );
  }

  /** Path part for operation `usersControllerDeleteUser()` */
  static readonly UsersControllerDeleteUserPath = '/admin/users/id/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `usersControllerDeleteUser()` instead.
   *
   * This method doesn't expect any request body.
   */
  usersControllerDeleteUser$Response(
    params: {
      id: number;
    },
    context?: HttpContext
): Observable<StrictHttpResponse<UserResDto>> {
    const rb = new RequestBuilder(this.rootUrl, UsersApiClient.UsersControllerDeleteUserPath, 'delete');
    if (params) {
      rb.path('id', params.id, {});
    }

    return this.http.request(
      rb.build({ responseType: 'json', accept: 'application/json', context })
    ).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<UserResDto>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `usersControllerDeleteUser$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  usersControllerDeleteUser(
    params: {
      id: number;
    },
    context?: HttpContext
): Observable<UserResDto> {
    return this.usersControllerDeleteUser$Response(params, context).pipe(
      map((r: StrictHttpResponse<UserResDto>): UserResDto => r.body)
    );
  }

  /** Path part for operation `usersControllerUpdateUser()` */
  static readonly UsersControllerUpdateUserPath = '/admin/users/id/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `usersControllerUpdateUser()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  usersControllerUpdateUser$Response(
    params: {
      id: number;
      body: UpdateUserDto
    },
    context?: HttpContext
): Observable<StrictHttpResponse<UserResDto>> {
    const rb = new RequestBuilder(this.rootUrl, UsersApiClient.UsersControllerUpdateUserPath, 'patch');
    if (params) {
      rb.path('id', params.id, {});
      rb.body(params.body, 'application/json');
    }

    return this.http.request(
      rb.build({ responseType: 'json', accept: 'application/json', context })
    ).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<UserResDto>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `usersControllerUpdateUser$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  usersControllerUpdateUser(
    params: {
      id: number;
      body: UpdateUserDto
    },
    context?: HttpContext
): Observable<UserResDto> {
    return this.usersControllerUpdateUser$Response(params, context).pipe(
      map((r: StrictHttpResponse<UserResDto>): UserResDto => r.body)
    );
  }

  /** Path part for operation `usersControllerCreateEmailVerificationChallengeForUser()` */
  static readonly UsersControllerCreateEmailVerificationChallengeForUserPath = '/admin/users/id/{id}/challenges/email-verification';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `usersControllerCreateEmailVerificationChallengeForUser()` instead.
   *
   * This method doesn't expect any request body.
   */
  usersControllerCreateEmailVerificationChallengeForUser$Response(
    params: {
      id: number;
    },
    context?: HttpContext
): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, UsersApiClient.UsersControllerCreateEmailVerificationChallengeForUserPath, 'post');
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
   * To access the full response (for headers, for example), `usersControllerCreateEmailVerificationChallengeForUser$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  usersControllerCreateEmailVerificationChallengeForUser(
    params: {
      id: number;
    },
    context?: HttpContext
): Observable<void> {
    return this.usersControllerCreateEmailVerificationChallengeForUser$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

}
