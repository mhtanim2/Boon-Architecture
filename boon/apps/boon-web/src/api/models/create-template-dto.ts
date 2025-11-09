/* tslint:disable */
/* eslint-disable */
export interface CreateTemplateDto {
  composizione: Array<{
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
'nome'?: string;
};
  nome: string;
  stato: {
'id': number;
'nome'?: string;
};
}
