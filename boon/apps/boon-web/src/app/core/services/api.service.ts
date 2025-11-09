import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@boon/frontend/environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiClientService {
  constructor(private readonly http: HttpClient, private readonly router: Router) {}

  get baseUrl() {
    return environment.API_URL;
  }

  private formatErrors(error: unknown) {
    return throwError(() => error);
  }

  get<T>(path: string, options: Parameters<HttpClient['get']>[1] & { baseUrl?: string } = {}): Observable<T> {
    const { baseUrl, ...opts } = options;
    const url = `${baseUrl ?? this.baseUrl}${path}`;

    return this.http.get<T>(url, opts).pipe(
      // retry(1),
      catchError((e) => {
        if (e?.error?.error?.name === 'TokenExpiredError') {
          this.router.navigate(['login'], {
            queryParams: { session: 'expired' },
          });
        }
        return this.formatErrors(e);
      }),
      shareReplay(1)
    );
  }

  put<T>(
    path: string,
    body: Parameters<HttpClient['put']>[1] = {},
    options: Parameters<HttpClient['put']>[2] & { baseUrl?: string } = {}
  ): Observable<T> {
    const { baseUrl, ...opts } = options;
    const url = `${baseUrl ?? this.baseUrl}${path}`;

    return this.http.put<T>(url, body, opts).pipe(
      catchError((e) => {
        if (e?.error?.error?.name === 'TokenExpiredError') {
          this.router.navigate(['login'], {
            queryParams: { session: 'expired' },
          });
        }
        return this.formatErrors(e);
      })
    );
  }

  patch<T>(
    path: string,
    body: Parameters<HttpClient['patch']>[1] = {},
    options: Parameters<HttpClient['patch']>[2] & { baseUrl?: string } = {}
  ): Observable<T> {
    const { baseUrl, ...opts } = options;
    const url = `${baseUrl ?? this.baseUrl}${path}`;

    return this.http.patch<T>(url, body, opts).pipe(
      catchError((e) => {
        if (e?.error?.error?.name === 'TokenExpiredError') {
          this.router.navigate(['login'], {
            queryParams: { session: 'expired' },
          });
        }
        return this.formatErrors(e);
      })
    );
  }

  post<T>(
    path: string,
    body: Parameters<HttpClient['post']>[1] = {},
    options: Parameters<HttpClient['post']>[2] & { baseUrl?: string } = {}
  ): Observable<T> {
    const { baseUrl, ...opts } = options;
    const url = `${baseUrl ?? this.baseUrl}${path}`;

    return this.http.post<T>(url, body, opts).pipe(
      // retry(1),
      catchError((e) => {
        if (e?.error?.error?.name === 'TokenExpiredError') {
          this.router.navigate(['login'], {
            queryParams: { session: 'expired' },
          });
        }
        return this.formatErrors(e);
      }),
      shareReplay(1)
    );
  }

  delete<T>(path: string, options: Parameters<HttpClient['delete']>[1] & { baseUrl?: string } = {}): Observable<T> {
    const { baseUrl, ...opts } = options;
    const url = `${baseUrl ?? this.baseUrl}${path}`;

    return this.http.delete<T>(url, opts).pipe(
      catchError((e) => {
        if (e?.error?.error?.name === 'TokenExpiredError') {
          this.router.navigate(['login'], {
            queryParams: { session: 'expired' },
          });
        }
        return this.formatErrors(e);
      })
    );
  }

  uploadFile<T>(path: string, files: File[], params?: Record<string, unknown>, baseUrl?: string): Observable<T> {
    baseUrl ??= this.baseUrl + '';

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('file', file, file.name);
    });

    if (params) {
      const paramrArray = Object.keys(params).map((key) => ({
        name: key,
        value: params[key],
      }));
      paramrArray.forEach((param) => {
        formData.append(param.name, param.value as any);
      });
    }

    return this.http
      .post<T>(`${baseUrl}${path}`, formData, {
        headers: new HttpHeaders({
          'X-Requested-With': 'XMLHttpRequest',
          Accept: 'application/json',
        }),
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        map((event) => {
          switch (event.type) {
            case HttpEventType.UploadProgress: {
              const progress = Math.round((100 * event.loaded) / (event.total ?? 0));
              return { status: 'progress', message: progress };
            }
            case HttpEventType.Response: {
              const res: any = { body: event.body, status: event.status };
              return res;
            }
            default:
              return `Unhandled event: ${event.type}`;
          }
        })
      );

    //return this.http.request(req);
  }

  // getPDF<T>(path: string, body = {}): Observable<T> {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     Accept: 'application/json',
  //   });
  //   return this.http
  //     .post<T>(`${this.baseUrl}${path}`, body, {
  //       headers: headers,
  //     })
  //     .pipe(catchError(this.formatErrors));
  // }

  // downloadFileAsBlob(
  //   path: string,
  //   baseUrl?: string,
  //   filename?: string,
  //   skipSave?: boolean
  // ): Observable<{ blob: Blob; filename: string; contentType: string } | null> {
  //   baseUrl ??= this.baseUrl + '';
  //   skipSave ??= false;

  //   const getFilenameFromContentDisposition = (res: HttpResponse<any>): string | undefined => {
  //     const contentDisposition = res.headers.get('Content-Disposition');
  //     const disposition = contentDisposition ? parseContentDisposition(contentDisposition) : undefined;
  //     const filename = disposition?.parameters?.['filename'];
  //     return filename;
  //   };

  //   return this.http.get(`${baseUrl}${path}`, { observe: 'response', responseType: 'blob' }).pipe(
  //     map((res) => {
  //       const blob = res.body;
  //       const contentType = res.headers.get('Content-Type');
  //       filename ??= getFilenameFromContentDisposition(res);
  //       return blob && filename && contentType ? { blob: res.body, filename, contentType } : null;
  //     }),
  //     tap((res) => {
  //       if (res && !skipSave) this.fileSaverService.save(res.blob, res.filename);
  //     })
  //   );
  // }
}
