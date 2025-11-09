/* tslint:disable */
/* eslint-disable */
export interface UserMeResDto {
  cliente: {
'id': number;
'ragioneSociale': string;
'tenant'?: {
'id': number;
'slug': string;
'logo': string | null;
};
};
  clienti: Array<{
'id': number;
'ragioneSociale': string;
'tenant': {
'id': number;
'slug': string;
'logo': string | null;
};
'privilegi': Array<{
'idAccount': number;
'idCliente': number;
'cliente': string;
'idFunzionalita': number;
'codiceFunzionalita': string;
'funzionalita': string;
'idLivello': number | null;
'livello': string;
}>;
}>;
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
