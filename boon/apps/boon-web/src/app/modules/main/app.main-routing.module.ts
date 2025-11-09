import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrivilegeGuard, RoleGuard } from '../../core/guards';
import { AppMainComponent } from './app.main.component';

const routes: Routes = [
  {
    path: '',
    component: AppMainComponent,

    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./pages/home/home.component').then((mod) => mod.HomeComponent),
      },
      {
        path: 'admin',
        loadChildren: () => import('./pages/admin/admin.module').then((mod) => mod.AdminModule),
        canActivate: [RoleGuard],
        data: {
          expectedRoles: ['SUPERADMIN'],
        },
      },
      {
        path: 'import-articles',
        pathMatch: 'full',
        loadComponent: () =>
          import('./pages/import-articles/import-articles.component').then((mod) => mod.ImportArticlesComponent),
        canActivate: [PrivilegeGuard],
        data: {
          expectedPrivileges: ['IMPORT ARTICLES'],
        },
      },
      {
        path: 'import-shooting',
        pathMatch: 'full',
        loadComponent: () =>
          import('./pages/import-shooting/import-shooting.component').then((mod) => mod.ImportShootingComponent),
        canActivate: [PrivilegeGuard],
        data: {
          expectedPrivileges: ['IMPORT SHOOTING'],
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppMainRoutingModule {}
