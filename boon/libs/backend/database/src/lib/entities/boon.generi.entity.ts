import { Column, Entity, OneToMany } from 'typeorm';
import { BoonArticoliEntity } from './boon.articoli.entity';
import { BoonGeneriAliasEntity } from './boon.generi_alias.entity';

@Entity('generi', { schema: 'boon' })
export class BoonGeneriEntity {
  @Column('int', { primary: true, name: 'id' })
  id: number;

  @Column('varchar', { name: 'nome', length: 255 })
  nome: string;

  @Column('varchar', { name: 'sigla', length: 255 })
  sigla: string;

  @OneToMany(() => BoonArticoliEntity, (boonArticoliEntity) => boonArticoliEntity.genere)
  articoli: BoonArticoliEntity[];

  @OneToMany(() => BoonGeneriAliasEntity, (boonGeneriAliasEntity) => boonGeneriAliasEntity.genere, {
    cascade: true,
  })
  alias: BoonGeneriAliasEntity[];

  constructor(init?: Partial<BoonGeneriEntity>) {
    Object.assign(this, init);
  }
}
