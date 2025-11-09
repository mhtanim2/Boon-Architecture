/* tslint:disable */
/* eslint-disable */
export interface TemplateResExcerptDto {
  cliente: {
'id': number;
'ragioneSociale': string;
};
  composizione: Array<{
'id': number;
'nomeColonna': string;
'tipoDati': string;
'lunghezzaMassima': number | null;
'flagRichiesto': boolean;
'regola': string | null;
'posizione': number;
'dataMatch': string | null;
}>;
  funzionalita: {
'id': number;
'nome': string;
'descrizione': string;
};
  id: number;
  nome: string;
  stato: {
'id': number;
'nome': string;
'descrizione': string;
'flagAbilitato': boolean;
};
}
