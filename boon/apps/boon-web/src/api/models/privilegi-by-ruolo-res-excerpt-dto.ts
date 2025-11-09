/* tslint:disable */
/* eslint-disable */
export interface PrivilegiByRuoloResExcerptDto {
  privilegi: Array<{
'idFunzionalita': number;
'idLivello': number;
'flagAbilitata': boolean;
'funzionalita': string;
'livello': string;
}>;
  ruolo: {
'id': number;
'nome': string;
'descrizione': string;
'flagInterno': boolean;
};
}
