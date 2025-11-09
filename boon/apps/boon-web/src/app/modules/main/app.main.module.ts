import { SplitButtonModule } from 'primeng/splitbutton';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { AppFooterComponent } from '../ui/app.footer.component';
import { AppMenuComponent } from '../ui/app.menu.component';
import { MenuService } from '../ui/app.menu.service';
import { AppMenuitemComponent } from '../ui/app.menuitem.component';
import { AppTopBarComponent } from '../ui/app.topbar.component';
import { AppBreadcrumbComponent } from './../ui/app.breadcrumb.component';
import { AppBreadcrumbService } from './../ui/app.breadcrumb.service';
import { AppMainRoutingModule } from './app.main-routing.module';
import { AppMainComponent } from './app.main.component';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';

const avatarColors = ['#4EA6F1', '#62AD57', '#F2C343', '#842E9C', '#F18F54', '#7F251A'];

@NgModule({
  declarations: [
    AppMainComponent,
    AppMenuComponent,
    AppMenuitemComponent,
    AppTopBarComponent,
    AppFooterComponent,
    AppBreadcrumbComponent,
  ],
  imports: [CommonModule, AppMainRoutingModule, CalendarModule, CheckboxModule, AvatarModule, DividerModule, SplitButtonModule, ButtonModule, MenuModule],
  providers: [MessageService, MenuService, AppBreadcrumbService],
})
export class AppMainModule {}
