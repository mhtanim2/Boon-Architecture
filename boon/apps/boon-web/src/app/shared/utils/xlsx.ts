import * as xlsx from 'xlsx';

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
