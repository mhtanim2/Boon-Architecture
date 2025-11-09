import { Injectable } from '@angular/core';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { catchError, map, tap, throwError } from 'rxjs';
import { StatoRevisioneResExcerptDto, TenantResDto } from '../../../../../../../api/models';
import { RevisioniStatiRevisioniApiClient } from '../../../../../../../api/services';
import { convertLazyLoadEvent } from '../../../../../../core/utils/lazy-loading-event.utils';

@Injectable({
  providedIn: 'root',
})
export class StatiRevisioniService {
  constructor(
    private readonly messageService: MessageService,
    private readonly revisioniStatiRevisioniApiClient: RevisioniStatiRevisioniApiClient
  ) {}

  getStatiRevisioni(event?: LazyLoadEvent) {
    const params = convertLazyLoadEvent(event ?? {})
      .finalize()
      .paramsify();
    return this.revisioniStatiRevisioniApiClient.statiRevisioniControllerFindStatiRevisioni(params).pipe(
      map((res) => ({
        data: res.data,
        totalRecords: res.meta.totalItems,
      })),
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          summary: `Can't get the list of revision statuses`,
          detail: `${err.error?.message ?? err.message}`,
        });
        return throwError(() => err);
      })
    );
  }

  editRevisione(stato: StatoRevisioneResExcerptDto, tenant: TenantResDto) {
    const params = {
      id: stato.id,
      tenat: tenant,
      body: {
        descrizione: stato.descrizione,
      },
    };
    return this.revisioniStatiRevisioniApiClient.statiRevisioniControllerUpdateStatoRevisione(params).pipe(
      tap(() => {
        this.messageService.add({
          severity: 'success',
          summary: `Success`,
          detail: `Status description modified correctly`,
        });
      }),
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          summary: `Unable to modify status at the moment, try later`,
          detail: `${err.error?.message ?? err.message}`,
        });
        return throwError(() => err);
      })
    );
  }
}
