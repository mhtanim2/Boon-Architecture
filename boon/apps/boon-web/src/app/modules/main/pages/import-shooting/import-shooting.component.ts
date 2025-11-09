import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { isDefined } from '@boon/common/core';
import { RxState } from '@rx-angular/state';
import { RxLet } from '@rx-angular/template/let';
import { XlsFileUploadService } from 'apps/boon-web/src/app/components/xls-file-upload/xfs-file-upload.service';
import dayjs from 'dayjs';
import { first } from 'lodash';
import prettyBytes from 'pretty-bytes';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { EMPTY, catchError, distinctUntilKeyChanged, endWith, filter, map, of, startWith, switchMap } from 'rxjs';
import { FileUploadResExcerptDto, TemplateResExcerptDto } from '../../../../../api/models';
import { FileUploadsApiClient } from '../../../../../api/services';
import { XlsFileUploadComponent } from '../../../../components';
import { ActiveTenantResolver } from '../../../../core/guards/tenant.guard';
import { getInitialTableLazyLoadEvent } from '../../../../core/utils/lazy-loading-event.utils';
import { AppBreadcrumbService } from '../../../ui/app.breadcrumb.service';
import { ImportShootingService } from './import-shooting.service';

interface State {
  tableIsLoading: boolean;
  tableFiles: FileUploadResExcerptDto[];
  selectedFiles: FileUploadResExcerptDto[];
  filesTotalCount: number;
  currentFilter?: TableLazyLoadEvent;
  cdIsLoading: boolean;

  templatesIsLoading: boolean;
  templates: TemplateResExcerptDto[];
  selectedTemplate: TemplateResExcerptDto | undefined;
}

@Component({
  selector: 'boon-import-shooting',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    RxLet,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    FileUploadModule,
    InputTextModule,
    SkeletonModule,
    XlsFileUploadComponent,
    ConfirmDialogModule,
    ToastModule,
  ],
  templateUrl: './import-shooting.component.html',
  providers: [RxState, ConfirmationService],
  styleUrls: ['./import-shooting.component.scss'],
})
export class ImportShootingComponent {
  model$ = this.state.select();
  filesTable: Table;

  @ViewChild('xlsFileUpload') xlsFileUpload: XlsFileUploadComponent;

  @ViewChild('filesTable') set filesTableSetter(table: Table) {
    if (!table || this.filesTable) return;
    this.filesTable = table;
    this.state.connect(
      'currentFilter',
      table.onLazyLoad.asObservable().pipe(startWith(getInitialTableLazyLoadEvent(table)))
    );
  }

  file: File | null;
  data: any | null;
  cols: { header: string; field: string; sortField?: string }[] | null = [
    {
      header: 'File name',
      field: 'nomeFile',
      sortField: 'nomeFile',
    },
    {
      header: 'Used',
      field: 'used',
      sortField: 'used',
    },
    {
      header: 'Size',
      field: 'dimensione',
      sortField: 'dimensione',
    },
    {
      header: 'Import date',
      field: 'dataOra',
      sortField: 'dataOra',
    },
    {
      header: 'Last modified',
      field: 'ultimaModifica',
      sortField: 'ultimaModifica',
    },
    {
      header: 'Imported by',
      field: 'importedBy',
      sortField: 'importedBy',
    },
    {
      header: 'Actions',
      field: 'azioni',
    },
  ];

  constructor(
    private readonly breadcrumbService: AppBreadcrumbService,
    private readonly state: RxState<State>,
    private readonly tenantResolver: ActiveTenantResolver,
    private readonly importShootingService: ImportShootingService,
    private confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private readonly fileUploadsApiClient: FileUploadsApiClient,
    private readonly xlsFileUploadService: XlsFileUploadService
  ) {
    this.breadcrumbService.setItems([{ label: 'Home' }, { label: 'Import shooting' }]);

    const fetchFilesOnFilterChange$ = this.state.$.pipe(
      distinctUntilKeyChanged('currentFilter'),
      map((s) => s.currentFilter),
      filter(isDefined),
      switchMap((filter) => this.getTableFiles(filter as LazyLoadEvent))
    );
    this.state.connect(fetchFilesOnFilterChange$);

    const fetchTemplatesForImportShooting$ = of(EMPTY).pipe(
      switchMap(() => this.importShootingService.getTemplatesForImportShooting()),
      map((res) => ({
        templates: res.data
          .filter((x) => x.stato.flagAbilitato)
      })),
      map((s) => ({
        ...s,
        selectedTemplate: s.templates.length > 1 ? undefined : first(s.templates),
      })),
      catchError(() => of(null)),
      startWith({ templatesIsLoading: true }),
      endWith({ templatesIsLoading: false })
    );
    this.state.connect(fetchTemplatesForImportShooting$);

    this.state.set({
      tableIsLoading: false,
      selectedFiles: [],
      templates: [],
    });
  }

  getTableFiles(filter: LazyLoadEvent) {
    return this.importShootingService.getTableFiles(filter).pipe(
      map((res) => ({
        tableFiles: res.data,
        filesTotalCount: res.totalRecords,
      })),
      catchError(() => of(null)),
      startWith({ tableIsLoading: true }),
      endWith({ tableIsLoading: false })
    );
  }

  onTableGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  exportExcel(data: FileUploadResExcerptDto[]) {
    const excelData = data.map((x) => ({
      'File name': x.nomeFile ?? '',
      // used
      Size: x.dimensione ? this.prettyBytes(x.dimensione) : '',
      'Import date': x.dataOra ? dayjs(x.dataOra).format('DD-MM-YYYY') : '',
      'Last modified': x.ultimaModifica ? dayjs(x.ultimaModifica).format('DD-MM-YYYY') : '',
      'Imported by': x.uploader ? x.uploader.nome + ' ' + x.uploader.cognome : '',
    }));
    this.importShootingService.downloadExcel(excelData);
  }

  downloadTemplate() {
    const template = this.state.get('selectedTemplate');
    this.xlsFileUploadService.exportExcel(template.nome, template.composizione, [], { save: true });
  }

  getDownloadLink(row: FileUploadResExcerptDto) {
    return `api/${this.tenantResolver.resolve().slug}/file-uploads/id/${row.id}/download`;
  }

  prettyBytes(value: number) {
    return prettyBytes(value);
  }

  showDeleteDialog(row): void {
    this.confirmationService.confirm({
      key: 'cd',
      header: 'Delete file',
      message: 'Are you sure you want to delete this file?',
      accept: () => {
        const tenant = this.tenantResolver.resolve();
        const fetchFilesOnDelete$ = this.importShootingService.deleteFile(row.id, tenant.slug).pipe(
          map(() => {
            const tempTableFiles = this.state.get('tableFiles');
            tempTableFiles.splice(tempTableFiles.indexOf(row), 1);
            return { tableFiles: tempTableFiles };
          }),
          catchError(() => of({})),
          startWith({ cdIsLoading: true }),
          endWith({ cdIsLoading: false })
        );
        this.state.connect(fetchFilesOnDelete$);
      },
    });
  }

  uploadIsDone(event: { originalFile: File; data: any[] }) {
    const EXCEL_EXTENSION = '.xlsx';
    const { originalFile, data } = event;
    const template = this.state.get('selectedTemplate');
    const filename = originalFile.name.substring(0, originalFile.name.lastIndexOf('.'));

    const isItOldFileID = this.state.get('tableFiles').find((element) => filename + EXCEL_EXTENSION === element.nomeFile)?.id;
    const file = this.xlsFileUploadService.exportExcel(filename, template.composizione, data);

    const fetchFilesOnUpload$ = of(EMPTY).pipe(
      switchMap(() => {
        return isItOldFileID === undefined
          ? this.importShootingService.uploadFile(template, file)
          : this.importShootingService.editFile(file, isItOldFileID);
      }),
      catchError((err) => {
        return of(null);
      }),
      map((res) => {
        if (!res) return {};
        this.xlsFileUpload.clearFile();
        if (isItOldFileID) {
          const tempTableFiles = this.state.get('tableFiles');
          tempTableFiles.splice(
            tempTableFiles.indexOf(tempTableFiles.find((element) => element.id === isItOldFileID)),
            1,
            res
          );
          return { tableFiles: tempTableFiles };
        } else {
          const tempTableFiles = this.state.get('tableFiles');
          tempTableFiles.push(res);
          return { tableFiles: tempTableFiles };
        }
      })
    );
    this.state.connect(fetchFilesOnUpload$);
  }

  deleteSelectedFiles(files: FileUploadResExcerptDto[]) {
    this.confirmationService.confirm({
      key: 'cd',
      header: files.length === 1 ? 'Delete 1 file' : 'Delete ' + files.length + ' files',
      message:
        files.length === 1
          ? 'Are you sure you want to delete this file?'
          : 'Are you sure you want to delete these ' + files.length + ' files',
      accept: () => {
        const tenant = this.tenantResolver.resolve();
        files.forEach((file) => {
          const fetchFilesOnDelete$ = this.importShootingService.deleteFile(file.id, tenant.slug).pipe(
            map(() => {
              const tempTableFiles = this.state.get('tableFiles');
              tempTableFiles.splice(tempTableFiles.indexOf(file), 1);
              return { tableFiles: tempTableFiles };
            }),
            catchError(() => of({})),
            startWith({ cdIsLoading: true }),
            endWith({ cdIsLoading: false })
          );
          this.state.connect(fetchFilesOnDelete$);
        });
      },
    });
  }
}
