import { Column, Entity, OneToMany } from 'typeorm';
import { BoonSpecificheArticoliEntity } from './boon.specifiche_articoli.entity';

@Entity('specifiche', { schema: 'boon' })
export class BoonSpecificheEntity {
  @Column('int', { primary: true, name: 'id' })
  id: number;

  @Column('varchar', { name: 'nome', length: 255 })
  nome: string;

  @Column('varchar', { name: 'descrizione', length: 255 })
  descrizione: string;

  @OneToMany(
    () => BoonSpecificheArticoliEntity,
    (boonSpecificheArticoliEntity) => boonSpecificheArticoliEntity.specifica
  )
  specificheArticoli: BoonSpecificheArticoliEntity[];

  constructor(init?: Partial<BoonSpecificheEntity>) {
    Object.assign(this, init);
  }
}
