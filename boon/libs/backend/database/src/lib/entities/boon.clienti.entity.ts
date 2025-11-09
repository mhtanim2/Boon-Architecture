import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { boolTinyIntTransformer } from '../utils';
import { BoonAccountsEntity } from './boon.accounts.entity';
import { BoonArticoliEntity } from './boon.articoli.entity';
import { BoonDestinatariEntity } from './boon.destinatari.entity';
import { BoonFunzionalitaClientiEntity } from './boon.funzionalita_clienti.entity';
import { BoonLuoghiEntity } from './boon.luoghi.entity';
import { BoonPrivilegiEntity } from './boon.privilegi.entity';
import { BoonStagioniClientiEntity } from './boon.stagioni_clienti.entity';
import { BoonTemplateClientiEntity } from './boon.template_clienti.entity';
import { BoonTenantsEntity } from './boon.tenants.entity';

@Entity('clienti', { schema: 'boon' })
export class BoonClientiEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'ragione_sociale', length: 255 })
  ragioneSociale: string;

  @Column('varchar', { name: 'partita_iva', nullable: true, length: 20 })
  partitaIva: string | null;

  @Column('varchar', { name: 'codice_fiscale', nullable: true, length: 20 })
  codiceFiscale: string | null;

  @Column('varchar', { name: 'codice_sdi', nullable: true, length: 255 })
  codiceSdi: string | null;

  @Column('varchar', { name: 'pec', nullable: true, length: 255 })
  pec: string | null;

  @Column('varchar', { name: 'indirizzo', nullable: true, length: 255 })
  indirizzo: string | null;

  @Column('varchar', { name: 'cap', nullable: true, length: 20 })
  cap: string | null;

  @Column('varchar', { name: 'codice_luogo', nullable: true, length: 5 })
  codiceLuogo: string | null;

  @Column('varchar', { name: 'telefono', nullable: true, length: 20 })
  telefono: string | null;

  @Column('varchar', { name: 'e_mail', nullable: true, length: 255 })
  eMail: string | null;

  @Column('varchar', { name: 'web', nullable: true, length: 255 })
  web: string | null;

  @Column('tinyint', { name: 'flag_interno', width: 1, default: () => "'0'", transformer: boolTinyIntTransformer })
  flagInterno: boolean;

  @OneToMany(() => BoonAccountsEntity, (boonAccountsEntity) => boonAccountsEntity.cliente)
  accounts: BoonAccountsEntity[];

  @OneToMany(() => BoonArticoliEntity, (boonArticoliEntity) => boonArticoliEntity.cliente)
  articoli: BoonArticoliEntity[];

  @ManyToOne(() => BoonLuoghiEntity, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'codice_luogo', referencedColumnName: 'codice' }])
  luogo: BoonLuoghiEntity;

  @OneToMany(() => BoonDestinatariEntity, (boonDestinatariEntity) => boonDestinatariEntity.cliente)
  destinatari: BoonDestinatariEntity[];

  @OneToMany(
    () => BoonFunzionalitaClientiEntity,
    (boonFunzionalitaClientiEntity) => boonFunzionalitaClientiEntity.cliente
  )
  funzionalitaClienti: BoonFunzionalitaClientiEntity[];

  @OneToMany(() => BoonPrivilegiEntity, (boonPrivilegiEntity) => boonPrivilegiEntity.cliente)
  privilegi: BoonPrivilegiEntity[];

  @OneToMany(() => BoonStagioniClientiEntity, (boonStagioniClientiEntity) => boonStagioniClientiEntity.cliente)
  stagioniClienti: BoonTemplateClientiEntity[];

  @OneToMany(() => BoonTemplateClientiEntity, (boonTemplateClientiEntity) => boonTemplateClientiEntity.cliente)
  templateClienti: BoonTemplateClientiEntity[];

  @OneToOne(() => BoonTenantsEntity, (boonTenantsEntity) => boonTenantsEntity.cliente, {
    cascade: true,
  })
  tenant: BoonTenantsEntity;

  constructor(init?: Partial<BoonClientiEntity>) {
    Object.assign(this, init);
  }
}
