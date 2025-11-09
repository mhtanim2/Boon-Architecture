import { Injectable } from '@angular/core';
import { BoonComposizioneTemplate } from '@boon/interfaces/database';
import { GenereResExcerptDto, StagioneClienteResExcerptDto } from 'apps/boon-web/src/api/models';
import { AdminGeneriApiClient, AdminStagioniApiClient } from 'apps/boon-web/src/api/services';
import dayjs from 'dayjs';
import * as FileSaver from 'file-saver';
import { isEmpty, memoize, sortBy } from 'lodash';
import { MessageService } from 'primeng/api';
import { catchError, lastValueFrom, map, throwError } from 'rxjs';
import * as xlsx from 'xlsx';

@Injectable({
  providedIn: 'root',
})
export class XlsFileUploadService {
  private readonly memoized: {
    getArticoliStagioniClienti: (idCliente: number) => Promise<StagioneClienteResExcerptDto[]>;
    getGeneriAliases: () => Promise<GenereResExcerptDto[]>;
  };

  constructor(
    private readonly adminGeneriApiClient: AdminGeneriApiClient,
    private readonly adminStagioniApiClient: AdminStagioniApiClient,
    private readonly messageService: MessageService
  ) {
    const getArticoliStagioniClienti = memoize(
      async (idCliente: number) =>
        await lastValueFrom(
          this.adminStagioniApiClient.stagioniClientiControllerFindStagioniClienti({}).pipe(
            map((res) => res.data),
            catchError((err) => {
              this.messageService.add({
                severity: 'error',
                summary: `Can't get the list of client seasons`,
                detail: `${err.error?.message ?? err.message}`,
              });
              return throwError(() => err);
            })
          )
        )
    );

    const getGeneriAliases = memoize(
      async () =>
        await lastValueFrom(
          this.adminGeneriApiClient.generiControllerFindGeneri({}).pipe(
            map((res) => res.data),
            catchError((err) => {
              this.messageService.add({
                severity: 'error',
                summary: `Can't get the list of genders`,
                detail: `${err.error?.message ?? err.message}`,
              });
              return throwError(() => err);
            })
          )
        )
    );

    const memoized = {
      getArticoliStagioniClienti,
      getGeneriAliases,
    };
    this.memoized = memoized;
  }

  async validateRow(idCliente: number, row: object, rules: BoonComposizioneTemplate[]) {
    const errors = [];

    for (const entry of Object.entries(row)) {
      const [key, value] = entry;

      const rule = rules.find((x) => x.nomeColonna === key);
      if (!rule) continue;

      const validRule = async (validationRule: any, value: any) => {
        switch (validationRule) {
          case 'number':
            return !isNaN(Number(value.toString()));
          case 'cap':
            return value.toString().length === 5 && !isNaN(Number(value.toString()));
          case 'articoli.idStagioneCliente':
          case 'articoli.idGenere': {
            const expectedValues = await this.getValues(idCliente, validationRule);
            return expectedValues.includes(value);
          }
          default:
            return true;
        }
      };

      const errorMessageRule = async (validationRule: any) => {
        switch (validationRule) {
          case 'number':
            return '* formato numerico non valido';
          case 'cap':
            return '* formato CAP non valido';
          case 'articoli.idStagioneCliente':
          case 'articoli.idGenere': {
            const expectedValues = await this.getValues(idCliente, validationRule);
            return `* value not acceptable (acceptable values: ${expectedValues.join(', ')})`;
          }
          default:
            return null;
        }
      };

      const error = [
        ...(rule.lunghezzaMassima && value.length > rule.lunghezzaMassima
          ? [{ maxLength: rule.lunghezzaMassima, message: `* value is too long (max: ${rule.lunghezzaMassima})` }]
          : []),
        ...(rule.flagRichiesto && !value
          ? [{ required: rule.flagRichiesto, message: '* required value is missing' }]
          : []),
        ...(value && rule.regola && !(await validRule(rule.regola, value))
          ? [{ ValidationRule: rule.regola, message: await errorMessageRule(rule.regola) }]
          : []),
      ];
      !isEmpty(error) ? errors.push({ col: key, errors: error }) : null;
    }
    return errors;
  }

  setError(rowData: any, col: { header: string; field: string }) {
    const err = rowData.errors.find((x) => x.col === col.field);
    return err?.errors;
  }

  getType(rules: BoonComposizioneTemplate[], col: { header: string; field: string }) {
    const rule = rules.find((x) => x.nomeColonna === col.field);
    return rule?.tipoDati ?? 'text';
  }

  async getValues(idCliente: number, regola: BoonComposizioneTemplate['regola'] | undefined) {
    switch (regola) {
      case 'articoli.idStagioneCliente': {
        const expectedEntities = await this.memoized.getArticoliStagioniClienti(idCliente);
        const expectedValues = expectedEntities.map((x) => x.codice);
        return expectedValues;
      }
      case 'articoli.idGenere': {
        const expectedEntities = await this.memoized.getGeneriAliases();
        const expectedValues = expectedEntities.flatMap((x) => x.alias);
        return expectedValues;
      }
      default:
        return [];
    }
  }

  uploadTemplate(files: File[], data: any) {
    const params = { parsedExcel: JSON.stringify(data) };
    console.log(params);
  }

  dateView(val: Date | string) {
    return dayjs(val).isValid() ? dayjs(val).format('DD/MM/YYYY') : val;
  }

  exportExcel(sheetName: string, rules: BoonComposizioneTemplate[], data: any[], opts: Partial<{ save: boolean; addDate: boolean }> = {}) {
    opts ??= {};
    const dataExport = data.map((row) => {
      return rules.reduce((accumulator, rule) => {
        let val = row[rule.nomeColonna];
        if (val && rule.tipoDati === 'date') {
          val = dayjs(val).format('DD/MM/YYYY');
        }
        accumulator[rule.nomeColonna] = val;
        return accumulator;
      }, {});
    });

    const header = sortBy(rules, (x) => x.posizione).map((col) => col.nomeColonna);
    const worksheet = xlsx.utils.json_to_sheet([]);
    xlsx.utils.sheet_add_json(worksheet, dataExport, { header: header });
    autofitColumns(worksheet);
    const workbook = { Sheets: { [sheetName]: worksheet }, SheetNames: [sheetName] };
    const excelBuffer: File = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    return this.saveAsExcelFile(excelBuffer, sheetName, opts);
  }

  saveAsExcelFile(buffer: any, fileName: string, opts: Partial<{ save: boolean; addDate: boolean }> = {}): File {
    opts ??= {};

    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    const name = `${fileName}${opts.addDate ? '_' + dayjs().format('YYYYMMDD_hhmmss') : ''}${EXCEL_EXTENSION}`;

    if (opts.save) {
      FileSaver.saveAs(data, name);
    }

    const file: File = new File([buffer], name, {
      type: EXCEL_TYPE,
    });
    return file;
  }
}

// From https://github.com/SheetJS/sheetjs/issues/1473#issuecomment-1377788715
export function autofitColumns(worksheet: xlsx.WorkSheet): void {
  if (!worksheet['!ref']) return;

  const [firstCol, lastCol] = worksheet['!ref'].replace(/\d/, '').split(':');

  const numRegexp = new RegExp(/\d+$/g);

  const firstColIndex = firstCol.charCodeAt(0);
  const lastColIndex = lastCol.charCodeAt(0);
  const rows = +(numRegexp.exec(lastCol)?.[0] ?? 0);

  const objectMaxLength: xlsx.ColInfo[] = [];

  // Loop on columns
  for (let colIndex = firstColIndex; colIndex <= lastColIndex; colIndex++) {
    const col = String.fromCharCode(colIndex);
    let maxCellLength = 0;

    // Loop on rows
    for (let row = 1; row <= rows; row++) {
      const cellLength = worksheet[`${col}${row}`].v.length + 1;
      if (cellLength > maxCellLength) maxCellLength = cellLength;
    }

    objectMaxLength.push({ width: maxCellLength });
  }
  worksheet['!cols'] = objectMaxLength;
}
