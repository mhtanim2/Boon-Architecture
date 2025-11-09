import { Column, Entity, OneToMany } from 'typeorm';
import { BoonArticoliEntity } from './boon.articoli.entity';

@Entity('stati_articoli', { schema: 'boon' })
export class BoonStatiArticoliEntity {
  @Column('int', { primary: true, name: 'id' })
  id: number;

  @Column('varchar', { name: 'nome', length: 255 })
  nome: string;

  @Column('varchar', { name: 'descrizione', length: 255 })
  descrizione: string;

  @OneToMany(() => BoonArticoliEntity, (boonArticoliEntity) => boonArticoliEntity.stato)
  articoli: BoonArticoliEntity[];

  constructor(init?: Partial<BoonStatiArticoliEntity>) {
    Object.assign(this, init);
  }
}
