import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActiveTenantResolver } from '@boon/frontend/core/guards/tenant.guard';
import { DEFAULT_TENANT } from '@boon/interfaces/boon-api';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { catchError, take, tap, throwError } from 'rxjs';
import { AuthService } from '../../core/services';

@UntilDestroy()
@Component({
  selector: 'boon-magic-link',
  templateUrl: './magic-link.component.html',
  standalone: true,
  styleUrls: ['./magic-link.component.scss'],
})
export class MagicLinkComponent {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private activeTenantResolver: ActiveTenantResolver,
    private authService: AuthService
  ) {
    if (this.activeTenantResolver.resolve().slug !== DEFAULT_TENANT.slug) {
      this.router.navigate([DEFAULT_TENANT.slug, 'magic-link']);
    }

    this.activatedRoute.queryParams.pipe(untilDestroyed(this)).subscribe(async (params) => {
      const action = params.action;
      const token = params.token;
      this.authService
        .magicLinkTokenCheck(token, action)
        .pipe(
          take(1),
          tap(() => {
            switch (action) {
              case 'RESET_PASSWORD':
                this.router.navigate([DEFAULT_TENANT.slug, 'reset-password']);
                break;
              default:
                this.router.navigate([this.activeTenantResolver.resolve().slug]);
                break;
            }
          }),
          catchError((err) => {
            this.router.navigate([this.activeTenantResolver.resolve().slug, 'login'], {
              queryParams: { errorCode: err.error },
              replaceUrl: true,
            });
            return throwError(() => err);
          })
        )
        .subscribe();
    });
  }
}
