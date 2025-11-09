/* tslint:disable */
/* eslint-disable */
export interface ClienteResExcerptDto {
  cap: null | string;
  codiceFiscale: null | string;
  codiceSdi: null | string;
  eMail: null | string;
  flagInterno: boolean;
  id: number;
  indirizzo: null | string;
  luogo: null | {
'codice': string;
'comune'?: string;
};
  partitaIva: null | string;
  pec: null | string;
  ragioneSociale: string;
  telefono: null | string;
  tenant: {
'slug': string;
'logo': string | null;
};
  web: null | string;
}
