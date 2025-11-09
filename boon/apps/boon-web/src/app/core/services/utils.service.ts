import { Injectable } from '@angular/core';
import {
  faFileAlt,
  faFileExcel,
  faFileImage,
  faFilePdf,
  faFilePowerpoint,
  faFileWord,
} from '@fortawesome/free-solid-svg-icons';
import * as dayjs from 'dayjs';
import { MessageService, PrimeIcons } from 'primeng/api';
// import { faFileImage, faFilePdf, faFileWord, faFileAlt, faFileExcel, faFilePowerpoint } from '@fortawesome/free-solid-svg-icons';
// import { } from '@fortawesome/free-regular-svg-icons';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor(private messageService: MessageService) {}

  tableResetFilter(table, storageKey) {
    const settingTable = JSON.parse(localStorage.getItem(storageKey));
    if (settingTable && table) {
      delete settingTable.filters;
      delete settingTable.selection;
      settingTable.sortOrder = 0;
      settingTable.sortField = '';
      localStorage.setItem(storageKey, JSON.stringify(settingTable));
      table.reset();
    }
  }

  tableSetColumnWidths(storageKey, width, firstExpandible) {
    const settingTable = JSON.parse(localStorage.getItem(storageKey));
    if (settingTable) {
      let columnWidths = settingTable.columnWidths;
      columnWidths = columnWidths.split(',');
      for (const key in columnWidths) {
        if (columnWidths.hasOwnProperty(key)) {
          if (+key === 0 && firstExpandible) {
            columnWidths[key] = firstExpandible;
          } else {
            columnWidths[key] = width;
          }
        }
      }
      settingTable.columnWidths = columnWidths.toString();
      localStorage.setItem(storageKey, JSON.stringify(settingTable));
    }
  }

  formatDateLL(date) {
    return date && date !== '9998-12-31' ? dayjs(date).format('LL') : '';
  }

  formatDateLLL(date) {
    return date && date !== '9998-12-31' ? dayjs(date).format('LLL') : '';
  }

  showAlert(severity, summary, detail, life = 5000) {
    this.messageService.clear();
    this.messageService.add({ severity, summary, detail, life });
  }

  getCalendarLocalization(lang) {
    let settings;
    switch (lang) {
      case 'it':
        settings = {
          firstDayOfWeek: 1,
          dayNames: ['Domenica', 'Lunedi', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'],
          dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'],
          dayNamesMin: ['Do', 'Lu', 'Ma', 'Me', 'Gi', 'Ve', 'Sa'],
          monthNames: [
            'Gennaio',
            'Febbraio',
            'Marzo',
            'Aprile',
            'Maggio',
            'Giugno',
            'Luglio',
            'Agosto',
            'Settembre',
            'Ottobre',
            'Novembre',
            'Dicembre',
          ],
          monthNamesShort: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
          today: 'Oggi',
          clear: 'Pulisci',
          weekHeader: 'Wk',
        };
        break;

      default:
        settings = {
          firstDayOfWeek: 0,
          dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
          monthNames: [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
          ],
          monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          today: 'Today',
          clear: 'Clear',
          weekHeader: 'Wk',
        };
        break;
    }

    return settings;
  }

  getIcon(codice) {
    let icon;
    let color;
    switch (codice) {
      case 'NW':
        icon = PrimeIcons.STAR;
        color = 'var(--cyan-300)';
        break;
      case 'RV':
        icon = PrimeIcons.CLOCK;
        color = 'var(--teal-300)';
        break;
      case 'ER':
        icon = PrimeIcons.EXCLAMATION_TRIANGLE;
        color = 'var(--yellow-500)';
        break;
      case 'OB':
        icon = PrimeIcons.TIMES_CIRCLE;
        color = '#dc3545';
        break;
      case 'CO':
        icon = PrimeIcons.THUMBS_UP;
        color = 'var(--green-300)';
        break;
      default:
        break;
    }
    return { icon, color };
  }

  /**
   * @description get icon and color from filename
   *
   * @param {*} filename
   * @returns
   * @memberof UtilsService
   */
  getIconByFile(filename) {
    const ext = filename.split('.').pop();
    let faDownload = faFileAlt;
    let iconClass = 'text-black';
    switch (ext.toLowerCase()) {
      case 'doc':
      case 'docx':
      case 'docm':
      case 'dotx':
      case 'dotm':
        faDownload = faFileWord;
        iconClass = 'iconWord';
        break;

      case 'xsl':
      case 'xlsx':
      case 'xlsm':
      case 'xltx':
      case 'xltm':
      case 'xlsb':
      case 'xlam':
      case 'csv':
        faDownload = faFileExcel;
        iconClass = 'iconExcel';
        break;

      case 'ppt':
      case 'pptx':
      case 'pptm':
      case 'potx':
      case 'potm':
      case 'ppam':
      case 'ppsx':
      case 'ppsm':
      case 'sldx':
      case 'sldm':
      case 'thmx':
        faDownload = faFilePowerpoint;
        iconClass = 'iconPowerPoint';
        break;

      case 'art':
      case 'bmp':
      case 'gif':
      case 'ico':
      case 'jpeg':
      case 'jpg':
      case 'psd':
      case 'raw':
      case 'tiff':
      case 'tif':
      case 'ai':
      case 'svg':
      case 'png':
        faDownload = faFileImage;
        iconClass = 'iconImg';
        break;

      case 'pdf':
        faDownload = faFilePdf;
        iconClass = 'iconPdf';
        break;

      default:
        faDownload = faFileAlt;
        break;
    }
    return {
      icon: faDownload,
      class: iconClass,
    };
  }
}
