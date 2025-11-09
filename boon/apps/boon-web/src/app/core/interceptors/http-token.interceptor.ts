import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@boon/frontend/core/services';
import { Observable, throwError } from 'rxjs';

import { Router } from '@angular/router';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error) => {
        if (
          error instanceof HttpErrorResponse &&
          error.status === HttpStatusCode.Unauthorized &&
          !request.url.split('/').find((path) => path === 'login') &&
          !request.url.split('/').find((path) => path === 'refresh')
        ) {
          return this.Handle401Error(error, request, next);
        }
        return throwError(() => error);
      })
    );
  }

  private Handle401Error(error: HttpErrorResponse, request: HttpRequest<any>, next: HttpHandler) {
    return this.authService.refreshAccessToken().pipe(
      switchMap((accessToken) => {
        return next.handle(request);
      }),
      catchError((refreshError) => {
        this.authService.purgeAuth();
        // this.router.navigate(['/login']);
        return throwError(() => error);
      })
    );
  }
}
