import { Column, Entity, OneToMany } from 'typeorm';
import { BoonAccountsEntity } from './boon.accounts.entity';
import { boolTinyIntTransformer } from '../utils';

@Entity('stati_accounts', { schema: 'boon' })
export class BoonStatiAccountsEntity {
  @Column('int', { primary: true, name: 'id' })
  id: number;

  @Column('varchar', { name: 'nome', length: 255 })
  nome: string;

  @Column('varchar', { name: 'descrizione', length: 255 })
  descrizione: string;

    @Column('tinyint', {
    name: 'flag_abilitato',
    width: 1,
    default: () => "'0'",
    transformer: boolTinyIntTransformer,
  })
  flagAbilitato: boolean;

  @OneToMany(() => BoonAccountsEntity, (boonAccountsEntity) => boonAccountsEntity.stato)
  accounts: BoonAccountsEntity[];

  constructor(init?: Partial<BoonStatiAccountsEntity>) {
    Object.assign(this, init);
  }
}
