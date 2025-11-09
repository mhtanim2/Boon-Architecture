import { Component } from '@angular/core';
import { ActiveTenantResolver } from '@boon/frontend/core/guards/tenant.guard';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MenuItem } from 'primeng/api';
import { UserResDto } from '../../../api/models';
import { AuthService } from '../../core/services';
import { AppComponent } from './../../app.component';
import { AppMainComponent } from './../main/app.main.component';

@UntilDestroy()
@Component({
  selector: 'app-topbar',
  template: `
    <div class="layout-topbar pt-3">
      <div class="layout-topbar-wrapper">
        <div class="layout-topbar-left ">
          <div
            class="layout-topbar-logo"
            id="logolink"
            style="cursor: pointer; outline: none;"
            [routerLink]="['/', activeTenant.resolve().slug]"
          >
            <div class="flex flex-row  align-content-center">
              <img
                id="app-logo"
                style="width: 108px; height: 50px; margin-right: 10px"
                [src]="'assets/images/logo_dark.png'"
                alt="poseidon-layout"
              />
              <p-divider layout="vertical"></p-divider>
              <img
                id="app-logo"
                style="height: 50px; position: relative;"
                [src]="activeTenant.resolve().logo"
                alt="poseidon-layout"
              />
            </div>
          </div>
        </div>

        <div class="layout-topbar-right">
          <a
            class="menu-button"
            href="#"
            (click)="appMain.onMenuButtonClick($event)"
          >
            <i class="pi pi-bars"></i>
          </a>

          <ul class="layout-topbar-actions">
            <li style="margin-right: 10px !important">
              <button
                type="button"
                class="p-button-outlined p-button-rounded ml-2"
                pButton
                pRipple
              >
                <img
                  alt="logo"
                  src="assets/icons/icon_download.svg"
                  style="width: 1.5rem"
                />
              </button>
            </li>

            <li>
              <p-menu
                #importMenu
                [model]="importMenuItems"
                [popup]="true"
                appendTo="body"
                [styleClass]="'mt-1'"
              ></p-menu>
              <p-button
                styleClass="p-button-outlined p-button-rounded"
                (click)="importMenu.toggle($event)"
                *ngIf="importMenuItems.length > 0"
              >
                <img
                  alt="logo"
                  src="assets/icons/icon_import.svg"
                  style="width: 1.5rem;margin-right: 7px "
                />
                <span style="font-family: 'Roboto-Medium'">IMPORT</span>
              </p-button>

              <!--
            <button
              type="button"
              label="IMPORT"
              class="p-button-outlined p-button-rounded ml-2"
              pButton
              pRipple
            >
            <img alt="logo" src="assets/icons/icon_import.svg" style="width: 1.5rem;margin-right: 10px " />
    </button> -->
            </li>

            <li
              #profile
              class="topbar-item user-profile"
              [ngClass]="{ 'active-topmenuitem': appMain.activeTopbarItem === profile }"
            >
              <a
                href="#"
                (click)="appMain.onTopbarItemClick($event, profile)"
              >
                <ng-container *ngTemplateOutlet="avatar"> </ng-container>
              </a>

              <ul class="fadeInDown">
                <li class="layout-submenu-header">
                  <ng-container *ngTemplateOutlet="avatar"> </ng-container>
                </li>

                <li
                  role="menuitem"
                  *ngIf="authService.currentUserTenants.length > 1"
                >
                  <a [routerLink]="['/switch-customer']">
                    <i class="pi pi-building"></i>
                    <h6>Switch customer</h6>
                  </a>
                </li>
                <li role="menuitem">
                  <a (click)="logout()">
                    <i class="pi pi-power-off"></i>
                    <h6>Logout</h6>
                  </a>
                </li>
              </ul>
            </li>
          </ul>

          <!-- <a class="layout-rightpanel-button" href="#" (click)="appMain.onRightPanelButtonClick($event)">
                        <i class="pi pi-arrow-left"></i>
                    </a> -->
        </div>
      </div>
    </div>

    <ng-template #avatar>
      <p-avatar
        shape="circle"
        styleClass=""
        [style]="{ 'background-color': '#60604D', color: '#ffffff', width: '2.5rem', height: '2.5rem' }"
        [label]="authService.userProfileInitials"
      ></p-avatar>
      <div class="profile-info">
        <h6>{{ user.nome }} {{ user.cognome }}</h6>
        <span>{{ user.username }}</span>
      </div>
    </ng-template>
  `,
})
export class AppTopBarComponent {
  user: UserResDto;
  importMenuItems: MenuItem[];
  items: MenuItem[] | undefined;

  constructor(
    public appMain: AppMainComponent,
    public app: AppComponent,
    public activeTenant: ActiveTenantResolver,
    public authService: AuthService
  ) {
    this.user = this.authService.getCurrentUser();
    this.importMenuItems = [];

    this.items = [
      {
        label: 'Options',
        items: [
          {
            label: 'Update',
            icon: 'pi pi-refresh',
          },
          {
            label: 'Delete',
            icon: 'pi pi-times',
          },
        ],
      },
      {
        label: 'Navigate',
        items: [
          {
            label: 'Angular',
            icon: 'pi pi-external-link',
            url: 'http://angular.io',
          },
          {
            label: 'Router',
            icon: 'pi pi-upload',
            routerLink: '/fileupload',
          },
        ],
      },
    ];
  }

  async ngOnInit() {
    if (await this.authService.checkPrivileges('IMPORT ARTICLES')) {
      this.importMenuItems.push({
        label: 'Import articles',
        routerLink: ['/', this.activeTenant.resolve().slug, 'import-articles'],
      });
    }

    if (await this.authService.checkPrivileges('IMPORT SHOOTING')) {
      this.importMenuItems.push({
        label: 'Import shooting',
        routerLink: ['/', this.activeTenant.resolve().slug, 'import-shooting'],
      });
    }
  }

  logout() {
    this.authService.logout().pipe(untilDestroyed(this)).subscribe();
  }
}
