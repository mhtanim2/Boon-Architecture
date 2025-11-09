import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { DEFAULT_TENANT } from '@boon/interfaces/boon-api';
import { isEmpty } from 'lodash';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, distinctUntilChanged, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { TenantResDto } from '../../../api/models';
import { TenantsApiClient } from '../../../api/services';

@Injectable({ providedIn: 'root' })
export class ActiveTenantResolver {
  private currentTenantSubject: BehaviorSubject<TenantResDto | null>;
  constructor() {
    this.currentTenantSubject = new BehaviorSubject<TenantResDto>(null);
  }

  get selectedTenant$() {
    return this.currentTenantSubject.asObservable().pipe(distinctUntilChanged(), shareReplay(1));
  }

  setTenant(tenant: TenantResDto) {
    this.currentTenantSubject.next(tenant);
  }

  resolve(): TenantResDto | null {
    return this.currentTenantSubject.value;
  }
}

@Injectable({ providedIn: 'root' })
export class TenantGuard {
  constructor(
    private readonly router: Router,
    private readonly tenantsApiClient: TenantsApiClient,
    private readonly activeTenantResolver: ActiveTenantResolver
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const rawTenant = route.paramMap.get('tenant');
    if (!isEmpty(rawTenant)) {
      if (route.routeConfig.children.map((x) => x.path).includes(rawTenant)) {
        this.router.navigate([DEFAULT_TENANT.slug, rawTenant]);
      }

      return of(rawTenant).pipe(
        switchMap((rawTenant) => {
          return rawTenant !== DEFAULT_TENANT.slug
            ? this.tenantsApiClient.tenantsControllerGetTenantInfo({ tenant: rawTenant })
            : of(DEFAULT_TENANT);
        }),
        tap((tenant) => {
          this.activeTenantResolver.setTenant(tenant);
        }),
        map((tenant) => !!tenant),
        catchError((err) => {
          this.router.navigate([DEFAULT_TENANT.slug, 'not-found']);
          return throwError(() => err);
        })
      );
    } else {
      return this.activeTenantResolver.selectedTenant$.pipe(map((tenant) => !!tenant));
    }
  }
}
