import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { boolTinyIntTransformer } from '../utils';
import { BoonAccountsClientiEntity } from './boon.accounts_clienti.entity';
import { BoonAccountsFunzionalitaEntity } from './boon.accounts_funzionalita.entity';
import { BoonClientiEntity } from './boon.clienti.entity';
import { BoonProfiliEntity } from './boon.profili.entity';
import { BoonRuoliEntity } from './boon.ruoli.entity';
import { BoonStatiAccountsEntity } from './boon.stati_accounts.entity';

@Entity('accounts', { schema: 'boon' })
export class BoonAccountsEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'id_stato', default: () => "'0'" })
  idStato: number;

  @Column('int', { name: 'id_cliente', default: () => "'0'" })
  idCliente: number;

  @Column('varchar', { name: 'username', length: 255 })
  username: string;

  @Column('varchar', { name: 'password', length: 255, nullable: true })
  password: string | null;

  @Column('date', { name: 'data_creazione' })
  dataCreazione: string;

  @Column('date', { name: 'data_scadenza', nullable: true })
  dataScadenza: string | null;

  @Column('tinyint', {
    name: 'flag_primo_accesso',
    width: 1,
    default: () => "'0'",
    transformer: boolTinyIntTransformer,
  })
  flagPrimoAccesso: boolean;

  @Column('varchar', { name: 'cognome', length: 255 })
  cognome: string;

  @Column('varchar', { name: 'nome', length: 255 })
  nome: string;

  @Column('varchar', {
    name: 'ultimo_hash_refresh_token',
    nullable: true,
    length: 1024,
  })
  ultimoHashRefreshToken: string | null;

  @Column('tinyint', {
    name: 'flag_email_verificata',
    width: 1,
    default: () => "'0'",
    transformer: boolTinyIntTransformer,
  })
  flagEmailVerificata: boolean;

  @Column('tinyint', {
    name: 'flag_password_da_cambiare',
    width: 1,
    default: () => "'0'",
    transformer: boolTinyIntTransformer,
  })
  flagPasswordDaCambiare: boolean;

  @ManyToOne(() => BoonClientiEntity, (boonClientiEntity) => boonClientiEntity.accounts, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'id_cliente', referencedColumnName: 'id' }])
  cliente: BoonClientiEntity;

  @ManyToOne(() => BoonStatiAccountsEntity, (boonStatiAccountsEntity) => boonStatiAccountsEntity.accounts, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'id_stato', referencedColumnName: 'id' }])
  stato: BoonStatiAccountsEntity;

  @OneToMany(() => BoonAccountsClientiEntity, (boonAccountsClientiEntity) => boonAccountsClientiEntity.account, {
    cascade: true,
  })
  accountsClienti: BoonAccountsClientiEntity[];

  @OneToMany(
    () => BoonAccountsFunzionalitaEntity,
    (boonAccountsFunzionalitaEntity) => boonAccountsFunzionalitaEntity.account,
    { cascade: true }
  )
  accountsFunzionalita: BoonAccountsFunzionalitaEntity[];

  @OneToMany(() => BoonProfiliEntity, (boonProfiliEntity) => boonProfiliEntity.account, {
    cascade: true,
  })
  profili: BoonProfiliEntity[];

  get ruoli(): BoonRuoliEntity[] {
    return this.profili?.flatMap((x) => x.ruolo);
  }

  constructor(init?: Partial<BoonAccountsEntity>) {
    Object.assign(this, init);
  }
}
