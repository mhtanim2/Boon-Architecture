/* tslint:disable */
/* eslint-disable */
export interface UserResExcerptDto {
  cliente: {
'id': number;
'ragioneSociale': string;
'tenant'?: {
'id': number;
'slug': string;
'logo': string | null;
};
};
  cognome: string;
  dataCreazione: string;
  dataScadenza: null | string;
  flagEmailVerificata: boolean;
  flagPasswordDaCambiare: boolean;
  flagPrimoAccesso: boolean;
  id: number;
  nome: string;
  ruoli: Array<{
'id': number;
'nome': string;
}>;
  stato: {
'id': number;
'nome': string;
'descrizione': string;
'flagAbilitato': boolean;
};
  username: string;
}
