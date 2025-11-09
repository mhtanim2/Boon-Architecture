import { Injectable } from '@angular/core';
import { PaginationQueryString } from '@boon/common/core';
import { TemplateResExcerptDto } from 'apps/boon-web/src/api/models';
import dayjs from 'dayjs';
import * as FileSaver from 'file-saver';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { catchError, map, tap, throwError } from 'rxjs';
import * as xlsx from 'xlsx';
import { FileUploadsApiClient, TemplateApiClient, ArticoliApiClient } from '../../../../../api/services';
import { convertLazyLoadEvent } from '../../../../core/utils/lazy-loading-event.utils';
import { autofitColumns } from '../../../../shared/utils/xlsx';

@Injectable({
  providedIn: 'root',
})
export class ImportArticlesService {
  private readonly idFunzionalita = 2; // TODO:: mappa funzionalità

  constructor(
    private readonly messageService: MessageService,
    private readonly templateApiClient: TemplateApiClient,
    private readonly fileUploadsApiClient: FileUploadsApiClient,
    private readonly articoliApiClient: ArticoliApiClient,
  ) {}

  getTemplatesForImportArticles() {
    const params = PaginationQueryString.builder()
      .addFilter('funzionalita.id', ['$eq'], this.idFunzionalita) // TODO: mappa funzionalità?
      .finalize()
      .paramsify();

    return this.templateApiClient.templateControllerFindTemplate(params).pipe(
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          summary: `Can't get the list of templates`,
          detail: `${err.error?.message ?? err.message}`,
        });
        return throwError(() => err);
      })
    );
  }

  getTableFiles(event?: LazyLoadEvent) {
    const params = convertLazyLoadEvent(event ?? {})
      .addFilter('template.funzionalita.id', ['$eq'], this.idFunzionalita)
      .finalize()
      .paramsify();
    return this.fileUploadsApiClient.fileUploadsControllerFindFileUploads(params).pipe(
      map((res) => ({
        data: res.data,
        totalRecords: res.meta.totalItems,
      })),
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          summary: `Can't get the list of files`,
          detail: `${err.error?.message ?? err.message}`,
        });
        return throwError(() => err);
      })
    );
  }

  deleteFile(id: number, slug: string) {
    const params = {
      id: id,
      tenant: slug,
    };
    return this.fileUploadsApiClient.fileUploadsControllerDeleteFileUpload(params).pipe(
      tap(() => {
        this.messageService.add({
          severity: 'success',
          summary: `Deletion complete`,
          detail: `File deleted successfully`,
        });
      }),
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          summary: `Can't delete user`,
          detail: `${err.error?.message ?? err.message}`,
        });
        return throwError(() => err);
      })
    );
  }

  uploadFile(template: TemplateResExcerptDto, file: File, data: any) {
    const params: { body: any } = {
      body: {
        data: JSON.stringify(data),
        template: JSON.stringify({ id: template.id }),
        file: file,
      },
    };
    return this.articoliApiClient.articoliControllerBulkImportArticoli(params).pipe(
      tap(() => {
        this.messageService.add({
          severity: 'success',
          summary: `Operation successful`,
          detail: `File uploaded successfully`,
        });
      }),
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          summary: `Can't upload file`,
          detail: `${err.error?.message ?? err.message}`,
        });
        return throwError(() => err);
      })
    );
  }

  editFile(file: File, fileId: number) {
    const params: {
      id: number;
      body: any; //TODO
    } = {
      id: fileId,
      body: {
        file: file,
      },
    };
    return this.fileUploadsApiClient.fileUploadsControllerUpdateFileUpload(params).pipe(
      tap(() => {
        this.messageService.add({
          severity: 'success',
          summary: `Operation successful`,
          detail: `File edited successfully`,
        });
      }),
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          summary: `Can't edit file`,
          detail: `${err.error?.message ?? err.message}`,
        });
        return throwError(() => err);
      })
    );
  }

  async downloadExcel(data) {
    const now = new Date();
    const fileName = 'Import-articles_' + dayjs(now).format('DD-MM-YYYY');
    const title = 'Import-articles_' + dayjs(now).format('DD-MM-YYYY');
    const headers = ['File name', 'Size', 'Import date', 'Last modified', 'Imported by'];

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
