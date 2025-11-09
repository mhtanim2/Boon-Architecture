import { LocationStrategy, PathLocationStrategy, registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FullCalendarModule } from '@fullcalendar/angular';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ApiModule } from '../api/api.module';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { AppBreadcrumbService } from './modules/ui/app.breadcrumb.service';
registerLocaleData(localeIt);

@NgModule({
  imports: [
    AppRoutingModule,
    CoreModule,
    BrowserAnimationsModule,
    BrowserModule,
    ApiModule.forRoot({ rootUrl: environment.API_URL }),
    FullCalendarModule,
    ToastModule,
  ],
  declarations: [AppComponent],
  providers: [
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    { provide: LOCALE_ID, useValue: 'it-IT' },
    AppBreadcrumbService,
    MessageService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
