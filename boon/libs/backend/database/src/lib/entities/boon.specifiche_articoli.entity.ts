import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BoonArticoliEntity } from './boon.articoli.entity';
import { BoonLingueEntity } from './boon.lingue.entity';
import { BoonSpecificheEntity } from './boon.specifiche.entity';

@Entity('specifiche_articoli', { schema: 'boon' })
export class BoonSpecificheArticoliEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'id_articolo' })
  idArticolo: number;

  @Column('int', { name: 'id_lingua' })
  idLingua: number;

  @Column('int', { name: 'id_specifica' })
  idSpecifica: number;

  @Column('varchar', { name: 'valore', length: 255 })
  valore: string;

  @ManyToOne(() => BoonArticoliEntity, (boonArticoliEntity) => boonArticoliEntity.specificheArticoli, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'id_articolo', referencedColumnName: 'id' }])
  articolo: BoonArticoliEntity;

  @ManyToOne(() => BoonLingueEntity, (boonLingueEntity) => boonLingueEntity.specificheArticoli, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'id_lingua', referencedColumnName: 'id' }])
  lingua: BoonLingueEntity;

  @ManyToOne(() => BoonSpecificheEntity, (boonSpecificheEntity) => boonSpecificheEntity.specificheArticoli, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'id_specifica', referencedColumnName: 'id' }])
  specifica: BoonSpecificheEntity;

  constructor(init?: Partial<BoonSpecificheArticoliEntity>) {
    Object.assign(this, init);
  }
}
