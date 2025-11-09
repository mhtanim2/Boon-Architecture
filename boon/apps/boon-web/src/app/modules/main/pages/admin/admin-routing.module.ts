import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,

    children: [
      {
        path: '',
        pathMatch: 'full',
        children: [],
      },
      {
        path: 'clients',
        loadComponent: () =>
          import('./pages/clients-management/clients-management.component').then(
            (mod) => mod.ClientsManagementComponent),
      },
      {
        path: 'clients/:clientSlug/template/new',
        loadComponent: () =>
        import('./pages/clients-templates/clients-template.component').then(
           (mod) => mod.ClientsTemplatesComponent),
      },
      {
        path: 'clients/:clientSlug/template/id/:id',
        loadComponent: () =>
        import('./pages/clients-templates/clients-template.component').then(
           (mod) => mod.ClientsTemplatesComponent),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./pages/users-management/users-management.component').then((mod) => mod.UsersManagementComponent),
      },
      {
        path: 'statuses',
        children: [
          {
            path: 'accounts',
            loadComponent: () =>
              import('./pages/stati-account/stati-account.component').then((mod) => mod.StatiAccountComponent),
          },
          {
            path: 'templates',
            loadComponent: () =>
              import('./pages/stati-template/stati-template.component').then((mod) => mod.StatiTemplateComponent),
          },
          {
            path: 'revisions',
            loadComponent: () =>
              import('./pages/stati-revisioni/stati-revisioni.component').then((mod) => mod.StatiRevisioniComponent),
          },
          {
            path: 'articles',
            loadComponent: () =>
              import('./pages/stati-articoli/stati-articoli.component').then((mod) => mod.StatiArticleComponent),
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
