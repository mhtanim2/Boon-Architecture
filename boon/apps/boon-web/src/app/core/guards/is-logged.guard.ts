import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Params, Router, RouterStateSnapshot } from '@angular/router';
import { DEFAULT_TENANT } from '@boon/interfaces/boon-api';
import { Observable, of, throwError } from 'rxjs';
import { catchError, distinctUntilChanged, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { TenantResDto, UserResDto } from '../../../api/models';
import { AuthService } from '../services';
import { ActiveTenantResolver } from './tenant.guard';

type CheckState = {
  canActivate: boolean;
  stopChecking: boolean;
};

@Injectable({ providedIn: 'root' })
export class IsLoggedGuard {
  constructor(
    private activeTenantResolver: ActiveTenantResolver,
    private authService: AuthService,
    private router: Router
  ) {}

  checkIfUserIsAuthenticated(params?: Params, destinationPath?: string) {
    return this.getUser().pipe(
      withLatestFrom(this.activeTenantResolver.selectedTenant$),
      map(([user, tenant]) => {
        const state = {
          canActivate: true,
          stopChecking: false,
        };

        this.checkIfPasswordReset(state, user, destinationPath, params);
        this.checkIfTenantIsNotSet(state, user, tenant, destinationPath);
        this.checkIfTenantIsAllowed(state, user, tenant, destinationPath);

        return state.canActivate;
      })
    );
  }

  getUser() {
    return this.authService.currentUser$.pipe(
      distinctUntilChanged(),
      switchMap((user) => {
        return user
          ? of(user)
          : this.authService.populate().pipe(
              catchError((err) => {
                this.router.navigate([this.activeTenantResolver.resolve().slug, 'login']);
                return throwError(() => err);
              })
            );
      })
    );
  }

  checkIfPasswordReset(state: CheckState, user: UserResDto, destinationPath?: string, params?: Params) {
    if (!state.canActivate || state.stopChecking) return;

    if (destinationPath === `/${DEFAULT_TENANT.slug}/reset-password`) {
      state.stopChecking = true;
      return;
    }

    if (user.flagPasswordDaCambiare) {
      const par: Params = { redirect: destinationPath, ...params };
      this.router.navigate([DEFAULT_TENANT.slug, 'reset-password'], { queryParams: par });
      state.stopChecking = true;
      return;
    }
  }

  checkIfTenantIsAllowed(state: CheckState, user: UserResDto, tenant: TenantResDto, destinationPath?: string) {
    if (!state.canActivate || state.stopChecking) return;

    if (
      tenant.slug !== DEFAULT_TENANT.slug &&
      !this.authService.currentUserTenants.map((x) => x.tenant.id).includes(tenant.id)
    ) {
      this.router.navigate([this.activeTenantResolver.resolve().slug, 'login']);

      state.canActivate = false;
      state.stopChecking = true;
      return;
    }
  }

  checkIfTenantIsNotSet(state: CheckState, user: UserResDto, tenant: TenantResDto, destinationPath?: string) {
    if (!state.canActivate || state.stopChecking) return;

    if (tenant.slug === DEFAULT_TENANT.slug && destinationPath !== `/${DEFAULT_TENANT.slug}/switch-customer`) {
      if (!(this.authService.currentUserTenants.length > 1)) {
        this.router.navigate([user.clienti[0].tenant.slug]);

        state.canActivate = true;
        state.stopChecking = true;
        return;
      } else if (this.authService.currentUserTenants.length > 1) {
        this.router.navigate([DEFAULT_TENANT.slug, 'switch-customer']);

        state.canActivate = true;
        state.stopChecking = true;
        return;
      }
    }
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const url = state.url;
    const relativePath = url.split('?');
    return this.checkIfUserIsAuthenticated(route.queryParams, relativePath[0]);
  }
}
