import { Injectable } from '@angular/core';
import { PaginationQueryString } from '@boon/common/core';
import dayjs from 'dayjs';
import * as FileSaver from 'file-saver';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { catchError, map, tap, throwError } from 'rxjs';
import * as xlsx from 'xlsx';
import {
  CreateClienteDto,
  TemplateResExcerptDto,
  UpdateClienteDto,
  UpdateTemplateDto
} from '../../../../../../../api/models';
import { ClientiApiClient, TemplateApiClient, TemplateStatiTemplateApiClient } from '../../../../../../../api/services';
import { convertLazyLoadEvent } from '../../../../../../core/utils/lazy-loading-event.utils';
import { autofitColumns } from '../../../../../../shared/utils/xlsx';
import { StorageApiClient } from './../../../../../../../api/services/storage-api-client';

@Injectable({
  providedIn: 'root',
})
export class ClientsManagementService {
  todayDate = new Date();

  constructor(
    private readonly messageService: MessageService,
    private readonly clientApiClient: ClientiApiClient,
    private readonly templateApiClient: TemplateApiClient,
    private readonly storageApiClient: StorageApiClient,
    private readonly templateStatiTemplateApiClient: TemplateStatiTemplateApiClient
  ) {}

  getClients(event?: LazyLoadEvent) {
    const params = convertLazyLoadEvent(event ?? {})
      .finalize()
      .paramsify();
    return this.clientApiClient.clientiControllerFindClienti(params).pipe(
      map((res) => ({
        data: res.data,
        totalRecords: res.meta.totalItems,
      })),
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          summary: `Can't get the list of clients`,
          detail: `${err.error?.message ?? err.message}`,
        });
        return throwError(() => err);
      })
    );
  }

  getTemplatesListByClientId(tenantSlug: string) {
    const params = PaginationQueryString.builder()
      .addOrder('nome', 'ASC')
      .finalize()
      .paramsify();
    params.tenant = tenantSlug;

    return this.templateApiClient.templateControllerFindTemplate(params).pipe(
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          summary: `Can't get client templates`,
          detail: `${err.error?.message ?? err.message}`,
        });
        return throwError(() => err);
      })
    );
  }

  getTemplateById(url) {
    const params = {
      wildcard: url,
    };
    return this.storageApiClient.storageControllerGetPrivateObject(params).pipe(
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          summary: `Can't download template`,
          detail: `${err.error?.message ?? err.message}`,
        });
        return throwError(() => err);
      })
    );
  }

  updateTemplateStateById(clientSlug: string, template: TemplateResExcerptDto) {
    const params = {
      id: template.id,
      body: {
        stato: { id:  template.stato.id },
      },
      tenant: clientSlug,
    };
    return this.templateApiClient.templateControllerUpdateTemplate(params).pipe(
      tap(() =>
        this.messageService.add({
          severity: 'success',
          summary: `Operation successful`,
          detail: `Template state updated successfully`,
        })
      ),
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          summary: `Can't change state template`,
          detail: `${err.error?.message ?? err.message}`,
        });
        return throwError(() => err);
      })
    );
  }

  getClientData(id: number) {
    const params = {
      id: id,
    };
    return this.clientApiClient.clientiControllerGetOneClienteById(params).pipe(
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          summary: `Can't get client info`,
          detail: `${err.error?.message ?? err.message}`,
        });
        return throwError(() => err);
      })
    );
  }

  createClient(client: CreateClienteDto) {
    const params = {
      body: client,
    };
    return this.clientApiClient.clientiControllerCreateCliente(params).pipe(
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          summary: `Can't create client`,
          detail: `${err.error?.message ?? err.message}`,
        });
        return throwError(() => err);
      })
    );
  }

  updateClient(id: number, client: UpdateClienteDto) {
    const params = {
      id: id,
      body: client,
    };
    return this.clientApiClient.clientiControllerUpdateCliente(params).pipe(
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          summary: `Can't update client`,
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

  async downloadExcel(data) {
    const fileName = 'Clients_' + dayjs(this.todayDate).format('DD-MM-YYYY');
    const title = 'Clients_' + dayjs(this.todayDate).format('DD-MM-YYYY');
    const headers = ['Business Name', 'Tax Id Number', 'SDI Code', 'E-mail', 'Pec', 'Phone Number', 'Web', 'Tenant'];

    const options = {
      fieldSeparator: ';',
      quoteStrings: '"',
      decimalseparator: ',',
      showLabels: true,
      showTitle: false,
      title,
      useBom: false,
      noDownload: false,
      headers,
      nullToEmptyString: true,
    };

    const worksheet = xlsx.utils.json_to_sheet(data);
    autofitColumns(worksheet);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, fileName);
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }
}
