import { Column, Entity, OneToMany } from 'typeorm';
import { BoonSpecificheArticoliEntity } from './boon.specifiche_articoli.entity';

@Entity('lingue', { schema: 'boon' })
export class BoonLingueEntity {
  @Column('int', { primary: true, name: 'id' })
  id: number;

  @Column('varchar', { name: 'nome', length: 255 })
  nome: string;

  @Column('varchar', { name: 'sigla', length: 255 })
  sigla: string;

  @OneToMany(() => BoonSpecificheArticoliEntity, (boonSpecificheArticoliEntity) => boonSpecificheArticoliEntity.lingua)
  specificheArticoli: BoonSpecificheArticoliEntity[];

  constructor(init?: Partial<BoonLingueEntity>) {
    Object.assign(this, init);
  }
}
