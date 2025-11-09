/* tslint:disable */
/* eslint-disable */
import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfiguration, ApiConfigurationParams } from './api-configuration';

import { AppApiClient } from './services/app-api-client';
import { ClientiApiClient } from './services/clienti-api-client';
import { TenantsApiClient } from './services/tenants-api-client';
import { AuthApiClient } from './services/auth-api-client';
import { UsersApiClient } from './services/users-api-client';
import { UsersStatiAccountsApiClient } from './services/users-stati-accounts-api-client';
import { FileUploadsApiClient } from './services/file-uploads-api-client';
import { ArticoliApiClient } from './services/articoli-api-client';
import { ArticoliStatiArticoliApiClient } from './services/articoli-stati-articoli-api-client';
import { AdminStagioniApiClient } from './services/admin-stagioni-api-client';
import { AdminGeneriApiClient } from './services/admin-generi-api-client';
import { RevisioniStatiRevisioniApiClient } from './services/revisioni-stati-revisioni-api-client';
import { TemplateApiClient } from './services/template-api-client';
import { TemplateStatiTemplateApiClient } from './services/template-stati-template-api-client';
import { PrivilegiApiClient } from './services/privilegi-api-client';
import { StorageApiClient } from './services/storage-api-client';

/**
 * Module that provides all services and configuration.
 */
@NgModule({
  imports: [],
  exports: [],
  declarations: [],
  providers: [
    AppApiClient,
    ClientiApiClient,
    TenantsApiClient,
    AuthApiClient,
    UsersApiClient,
    UsersStatiAccountsApiClient,
    FileUploadsApiClient,
    ArticoliApiClient,
    ArticoliStatiArticoliApiClient,
    AdminStagioniApiClient,
    AdminGeneriApiClient,
    RevisioniStatiRevisioniApiClient,
    TemplateApiClient,
    TemplateStatiTemplateApiClient,
    PrivilegiApiClient,
    StorageApiClient,
    ApiConfiguration
  ],
})
export class ApiModule {
  static forRoot(params: ApiConfigurationParams): ModuleWithProviders<ApiModule> {
    return {
      ngModule: ApiModule,
      providers: [
        {
          provide: ApiConfiguration,
          useValue: params
        }
      ]
    }
  }

  constructor( 
    @Optional() @SkipSelf() parentModule: ApiModule,
    @Optional() http: HttpClient
  ) {
    if (parentModule) {
      throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
    }
    if (!http) {
      throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
      'See also https://github.com/angular/angular/issues/20575');
    }
  }
}
