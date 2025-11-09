import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '@boon/frontend/core/services';
import { ActiveTenantResolver } from './tenant.guard';

@Injectable({ providedIn: 'root' })
export class RoleGuard {
  constructor(
    private readonly tenantResolver: ActiveTenantResolver,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const expectedRoles: string[] = route.data.expectedRoles ?? [];
    const canActivate = await this.authService.checkRoles(...expectedRoles);
    if (!canActivate) {
      await this.router.navigate([this.tenantResolver.resolve().slug, 'access-denied']);
      return false;
    }
    return true;
  }
}
