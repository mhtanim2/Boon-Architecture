/* tslint:disable */
/* eslint-disable */
export interface TemplateResDto {
  cliente: {
'id': number;
'ragioneSociale': string;
'partitaIva': string | null;
'codiceFiscale': string | null;
'codiceSdi': string | null;
'pec': string | null;
'indirizzo': string | null;
'cap': string | null;
'telefono': string | null;
'eMail': string | null;
'web': string | null;
'flagInterno': boolean;
'tenant': {
'slug': string;
'logo': string | null;
};
'luogo': {
'codice': string;
'comune'?: string;
} | null;
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
