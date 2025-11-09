import { Component, OnInit } from '@angular/core';
import { ActiveTenantResolver } from '@boon/frontend/core/guards/tenant.guard';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../core/services';
import { AppComponent } from './../../app.component';

@Component({
  selector: 'app-menu',
  template: `
    <ul class="layout-menu">
      <li
        app-menuitem
        *ngFor="let item of model; let i = index"
        [item]="item"
        [index]="i"
        [root]="true"
      ></li>
    </ul>
  `,
})
export class AppMenuComponent implements OnInit {
  model: MenuItem[];
  importMenu: MenuItem[];

  constructor(
    public app: AppComponent,
    private readonly activeTenant: ActiveTenantResolver,
    private readonly authService: AuthService
  ) {}

  async ngOnInit() {
    this.model = [{ label: 'Home', routerLink: ['/', this.activeTenant.resolve().slug] }];

    if (await this.authService.checkRoles('SUPERADMIN')) {
      this.model.push({
        label: 'Admin',
        items: [
          {
            label: 'Users management',
            routerLink: ['/', this.activeTenant.resolve().slug, 'admin', 'users'],
          },
          {
            label: 'Clients management',
            routerLink: ['/', this.activeTenant.resolve().slug, 'admin', 'clients'],
          },

          {
            label: 'Statuses management',
            items: [
              {
                label: 'Templates',
                routerLink: ['/', this.activeTenant.resolve().slug, 'admin', 'statuses', 'templates'],
              },
              {
                label: 'Articles',
                routerLink: ['/', this.activeTenant.resolve().slug, 'admin', 'statuses', 'articles'],
              },
              {
                label: 'Revisions',
                routerLink: ['/', this.activeTenant.resolve().slug, 'admin', 'statuses', 'revisions'],
              },
              {
                label: 'Users',
                routerLink: ['/', this.activeTenant.resolve().slug, 'admin', 'statuses', 'accounts'],
              },
            ],
          },
        ],
      });
    }
  }
}
