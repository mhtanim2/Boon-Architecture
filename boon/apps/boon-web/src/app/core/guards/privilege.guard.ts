import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService, RequiredPrivilege } from '@boon/frontend/core/services';
import { ActiveTenantResolver } from './tenant.guard';

@Injectable({ providedIn: 'root' })
export class PrivilegeGuard {
  constructor(
    private readonly tenantResolver: ActiveTenantResolver,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const expectedPrivileges: RequiredPrivilege[] = route.data.expectedPrivileges ?? [];
    const canActivate = await this.authService.checkPrivileges(...expectedPrivileges);
    if (!canActivate) {
      await this.router.navigate([this.tenantResolver.resolve().slug, 'access-denied']);
      return false;
    }
    return true;
  }
}
