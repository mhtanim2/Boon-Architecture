import { Column, Entity, OneToMany } from 'typeorm';
import { boolTinyIntTransformer } from '../utils';
import { BoonPrivilegiEntity } from './boon.privilegi.entity';
import { BoonProfiliEntity } from './boon.profili.entity';

@Entity('ruoli', { schema: 'boon' })
export class BoonRuoliEntity {
  @Column('int', { primary: true, name: 'id' })
  id: number;

  @Column('varchar', { name: 'nome', length: 255 })
  nome: string;

  @Column('varchar', { name: 'descrizione', length: 255 })
  descrizione: string;

  @Column('tinyint', { name: 'flag_interno', width: 1, default: () => "'0'", transformer: boolTinyIntTransformer })
  flagInterno: boolean;

  @OneToMany(() => BoonPrivilegiEntity, (boonPrivilegiEntity) => boonPrivilegiEntity.ruolo)
  privilegi: BoonPrivilegiEntity[];

  @OneToMany(() => BoonProfiliEntity, (boonProfiliEntity) => boonProfiliEntity.ruolo)
  profili: BoonProfiliEntity[];

  constructor(init?: Partial<BoonRuoliEntity>) {
    Object.assign(this, init);
  }
}
