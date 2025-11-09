import { Injectable } from '@angular/core';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { catchError, map, tap, throwError } from 'rxjs';
import { CreateTemplateDto, TemplateResDto, UpdateTemplateDto } from '../../../../../../../api/models';
import { TemplateApiClient, TemplateStatiTemplateApiClient, TenantsApiClient } from '../../../../../../../api/services';
import { convertLazyLoadEvent } from '../../../../../../core/utils/lazy-loading-event.utils';

export type TemplateRes = TemplateResDto;

@Injectable({
  providedIn: 'root',
})
export class ClientsTemplateService {
  todayDate = new Date();

  constructor(
    private readonly messageService: MessageService,
    private readonly templateApiClient: TemplateApiClient,
    private readonly tenantsApiClient: TenantsApiClient,
    private readonly templateStatiTemplateApiClient: TemplateStatiTemplateApiClient,
  ) {}

  getTemplateById(slug: string, templateId: number) {
    const params = {
      id: templateId,
      tenant: slug,
    };
    return this.templateApiClient.templateControllerFindOneTemplateById(params).pipe(
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          summary: `Can't get the template`,
          detail: `${err.error?.message ?? err.message}`,
        });
        return throwError(() => err);
      })
    );
  }

  createTemplate(slug: string, dto: CreateTemplateDto) {
    const params = {
      body: dto,
      tenant: slug,
    };
    return this.templateApiClient.templateControllerCreateTemplate(params).pipe(
      tap(() => {
        this.messageService.add({
          severity: 'success',
          summary: `Success`,
          detail: `Template created correctly`,
        });
      }),
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          summary: `Can't create the template`,
          detail: `${err.error?.message ?? err.message}`,
        });
        return throwError(() => err);
      })
    );
  }

  updateTemplate(slug: string, templateId: number, dto: UpdateTemplateDto) {
    const params = {
      id: templateId,
      body: dto,
      tenant: slug,
    };
    return this.templateApiClient.templateControllerUpdateTemplate(params).pipe(
      tap(() => {
        this.messageService.add({
          severity: 'success',
          summary: `Success`,
          detail: `Template modified correctly`,
        });
      }),
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          summary: `Can't update the template`,
          detail: `${err.error?.message ?? err.message}`,
        });
        return throwError(() => err);
      })
    );
  }

  getStatiTemplate(event?: LazyLoadEvent) {
    const params = convertLazyLoadEvent(event ?? {})
      .finalize()
      .paramsify();
    return this.templateStatiTemplateApiClient.statiTemplateControllerFindStatiTemplate(params).pipe(
      map((res) => ({
        data: res.data,
        totalRecords: res.meta.totalItems,
      })),
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          summary: `Can't get the list of template statuses`,
          detail: `${err.error?.message ?? err.message}`,
        });
        return throwError(() => err);
      })
    );
  }

  getFunzionalitaForClient(slug: string) {
    const params = {
      tenant: slug,
    };
    return this.tenantsApiClient.tenantsFeaturesControllerGetFunzionalita(params).pipe(
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          summary: `Can't get the template`,
          detail: `${err.error?.message ?? err.message}`,
        });
        return throwError(() => err);
      })
    );
  }
}
