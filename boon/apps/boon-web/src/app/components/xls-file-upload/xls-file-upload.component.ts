import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Queue } from '@boon/common/core';
import { TemplateResExcerptDto } from 'apps/boon-web/src/api/models';
import { difference, omitBy, sortBy } from 'lodash';
import { MessageService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { FileSelectEvent, FileUpload, FileUploadModule } from 'primeng/fileupload';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { Table, TableModule } from 'primeng/table';
import * as xlsx from 'xlsx';
import { ActiveTenantResolver } from '../../core/guards/tenant.guard';
import { XlsFileUploadService } from './xfs-file-upload.service';

export interface TableEditInitEvent {
  field: string;
  data: { row: any; index: number; col: { header: string; field: string } };
  index: number;
}
export interface TableEditCompleteEvent extends TableEditInitEvent {
  originalEvent: Event;
}
@Component({
  selector: 'boon-xls-file-upload',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FileUploadModule,
    TableModule,
    InputMaskModule,
    InputTextModule,
    InputNumberModule,
    SkeletonModule,
    CalendarModule,
  ],
  templateUrl: './xls-file-upload.component.html',
  styleUrls: ['./xls-file-upload.component.scss'],
})
export class XlsFileUploadComponent {
  @ViewChild('fileUpload') fileUpload: FileUpload;

  file: File | null;
  data: any[] | null;
  cols: { header: string; field: string }[] | null;
  hasSomeErrors: boolean;

  @Input() template: TemplateResExcerptDto;

  queue = new Queue<TableEditCompleteEvent>();

  @Output() uploadIsDone = new EventEmitter<{ originalFile: File; data: any[] }>();

  constructor(
    private readonly xlsFileUploadService: XlsFileUploadService,
    private readonly tenantResolver: ActiveTenantResolver,
    private readonly messageService: MessageService
  ) {}

  async onFileChange(event: FileSelectEvent) {
    const files = event.currentFiles;
    if (files && files.length) {
      const [file] = files;

      const buffer = await file.arrayBuffer();
      this.file = file;

      const wb = xlsx.read(buffer);
      const sheet = wb.Sheets[wb.SheetNames[0]];

      const header = xlsx.utils.sheet_to_json(sheet, { header: 1 })[0] as unknown[];
      const ruleHeader = sortBy(this.template.composizione, rule => rule.posizione).map((x) => x.nomeColonna);

      const missingTemplateColumns = difference(ruleHeader, header);
      if (missingTemplateColumns.length > 0) {
        this.messageService.add({
          severity: 'error',
          summary: 'File not acceptable',
          detail:
            `The file you are uploading is not compliant to the selected template, as it is missing the following columns: [${missingTemplateColumns.join(', ')}] (Make sure not to change the column names)`,
        });
        this.hasSomeErrors = true;
        this.fileUpload.clear();
        return;
      }
      const additionalUploadColumns = difference(header, ruleHeader);
      if (additionalUploadColumns.length > 0) {
        this.messageService.add({
          severity: 'warn',
          summary: 'File has additional columns',
          detail:
            `The file you are uploading has the following additional columns, which will be ignored: [${additionalUploadColumns.join(', ')}]`,
        });
      }

      const cols = ruleHeader.map((x) => ({
        header: `${x}`,
        field: `${x}`,
      }));
      this.cols = cols;
      const data = xlsx.utils.sheet_to_json(sheet);
      this.data = await Promise.all(
        data.map(async (row: object) => {
          const rowFiltered = omitBy(row, (value, key) => key.startsWith('__EMPTY') || additionalUploadColumns.includes(key));
          const errors = await this.xlsFileUploadService.validateRow(
            this.tenantResolver.resolve().cliente.id,
            rowFiltered,
            this.template.composizione
          );
          const hasErrors = errors.length > 0;

          return {
            ...rowFiltered,
            errors,
            hasErrors,
          };
        })
      );
      this.hasSomeErrors = this.data.some((x) => x.hasErrors);
    }
  }

  async clearFile() {
    this.fileUpload.clear();
  }

  async onFileClear() {
    this.file = null;
    this.cols = null;
    this.data = null;
    this.hasSomeErrors = true;
  }

  confirmUpload() {
    this.uploadIsDone.emit({
      originalFile: this.file,
      data: this.data,
    });
  }

  editInit(event: TableEditCompleteEvent) {
    this.queue.enqueue(event);
  }

  async editComplete(table: Table, event: TableEditCompleteEvent) {
    const event_ = this.queue.dequeue();

    const { errors, hasErrors, deletable, ...rowFiltered } = (table.filteredValue ?? table.value)[event_.data.index];

    (table.filteredValue ?? table.value)[event_.data.index].errors = await this.xlsFileUploadService.validateRow(
      this.tenantResolver.resolve().cliente.id,
      rowFiltered,
      this.template.composizione
    );
    (table.filteredValue ?? table.value)[event_.data.index].hasErrors =
      (table.filteredValue ?? table.value)[event_.data.index].errors.length > 0;
    this.hasSomeErrors = this.data.some((x) => x.hasErrors);
  }
}
