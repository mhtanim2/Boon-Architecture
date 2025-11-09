/* tslint:disable */
/* eslint-disable */
export interface ClienteResDto {
  cap: null | string;
  codiceFiscale: null | string;
  codiceSdi: null | string;
  eMail: null | string;
  flagInterno: boolean;
  id: number;
  indirizzo: null | string;
  luogo: null | {
'codice': string;
'comune': string;
'siglaProvincia': string;
'provincia': string;
'codiceRegione': string;
'regione': string;
'codiceStato': string;
'stato': string;
'flagAttivo': boolean;
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
