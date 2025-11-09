/* tslint:disable */
/* eslint-disable */
export interface CreateUserDto {
  cliente: {
'id': number;
'ragioneSociale'?: string;
};
  clienti: Array<{
'id': number;
'ragioneSociale'?: string;
'privilegi': Array<{
'idFunzionalita': number;
'idLivello': number;
'funzionalita'?: string;
'livello'?: string;
'flagAbilitata': boolean;
}>;
}>;
  cognome: string;
  flagEmailVerificata: boolean;
  flagPasswordDaCambiare: boolean;
  nome: string;
  ruoli: Array<{
'id': number;
'nome'?: string;
}>;
  stato: {
'id': number;
'nome'?: string;
};
  username: string;
}
