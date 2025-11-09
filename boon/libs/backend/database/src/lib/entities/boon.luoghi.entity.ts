import { Column, Entity } from 'typeorm';
import { boolTinyIntTransformer } from '../utils';

@Entity('luoghi', { schema: 'boon' })
export class BoonLuoghiEntity {
  @Column('varchar', { primary: true, name: 'codice', length: 5 })
  codice: string;

  @Column('varchar', { name: 'comune', length: 255 })
  comune: string;

  @Column('varchar', { name: 'sigla_provincia', length: 5 })
  siglaProvincia: string;

  @Column('varchar', { name: 'provincia', length: 255 })
  provincia: string;

  @Column('varchar', { name: 'codice_regione', length: 5 })
  codiceRegione: string;

  @Column('varchar', { name: 'regione', length: 255 })
  regione: string;

  @Column('varchar', { name: 'codice_stato', length: 5 })
  codiceStato: string;

  @Column('varchar', { name: 'stato', length: 255 })
  stato: string;

  @Column('tinyint', { name: 'flag_attivo', width: 1, default: () => "'1'", transformer: boolTinyIntTransformer })
  flagAttivo: boolean;

  constructor(init?: Partial<BoonLuoghiEntity>) {
    Object.assign(this, init);
  }
}
