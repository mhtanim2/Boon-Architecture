import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '@boon/frontend/core/services';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class RedirectGuard {
  constructor(public authService: AuthService, public router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    return this.authService.currentUser$.pipe(
      map((user) => {
        // TODO:
        return true;

        // if (!user || !user.privileges) {
        //     return false;
        // }
        // if (
        //     user &&
        //     user.privileges &&
        //     user.privileges
        //         .map(privilege => privilege.actionCode)
        //         .includes('DOCUMENTS')
        // ) {
        //     this.router.navigate(['/documenti']);
        //     return true;
        // }
        //  else if (
        //     user &&
        //     user.privileges &&
        //     user.privileges
        //         .map(privilege => privilege.actionCode)
        //     .includes('ACCOUNT_MANAGER')
        // ) {
        //     this.router.navigate(['/utenti']);
        //     return true;
        // }
        // else {
        //     return false;
        // }
      })
    );
  }
}
