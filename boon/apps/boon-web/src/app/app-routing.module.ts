import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DEFAULT_TENANT } from '@boon/interfaces/boon-api';
import { IsLoggedGuard } from './core/guards/is-logged.guard';
import { TenantGuard } from './core/guards/tenant.guard';

const routes: Routes = [
  {
    path: ':tenant',
    canActivate: [TenantGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./modules/main/app.main.module').then((mod) => mod.AppMainModule),
        canActivate: [IsLoggedGuard],
      },
      {
        path: 'login',
        loadComponent: () => import('./modules/login/app.login.component').then((mod) => mod.AppLoginComponent),
      },
      {
        path: 'recovery-password',
        loadComponent: () =>
          import('./modules/recovery-password/recovery-password.component').then(
            (mod) => mod.RecoveryPasswordComponent
          ),
      },
      {
        path: 'reset-password',
        loadComponent: () =>
          import('./modules/reset-password/reset-password.component').then((mod) => mod.ResetPasswordComponent),
        canActivate: [IsLoggedGuard],
      },
      {
        path: 'switch-customer',
        loadComponent: () =>
          import('./modules/switch-customer/switch-customer.component').then((mod) => mod.SwitchCustomerComponent),
        canActivate: [IsLoggedGuard],
      },
      {
        path: 'magic-login',
        loadComponent: () => import('./modules/magic-link/magic-link.component').then((mod) => mod.MagicLinkComponent),
      },
      {
        path: 'access-denied',
        loadComponent: () =>
          import('./modules/access-denied/app.accessdenied.component').then((mod) => mod.AppAccessdeniedComponent),
      },
      {
        path: '**',
        loadComponent: () =>
          import('./modules/not-found/app.notfound.component').then((mod) => mod.AppNotfoundComponent),
      },
    ],
  },
  {
    path: '',
    redirectTo: DEFAULT_TENANT.slug,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      paramsInheritanceStrategy: 'always',
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
