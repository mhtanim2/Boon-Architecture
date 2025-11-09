import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BoonArticoliEntity } from './boon.articoli.entity';
import { BoonRevisioniEntity } from './boon.revisioni.entity';

@Entity('foto', { schema: 'boon' })
export class BoonFotoEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'id_articolo' })
  idArticolo: number;

  @Column('varchar', { name: 'url', length: 255 })
  url: string;

  @ManyToOne(() => BoonArticoliEntity, (boonArticoliEntity) => boonArticoliEntity.foto, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'id_articolo', referencedColumnName: 'id' }])
  articolo: BoonArticoliEntity;

  @OneToMany(() => BoonRevisioniEntity, (boonRevisioniEntity) => boonRevisioniEntity.foto)
  revisioni: BoonRevisioniEntity[];

  constructor(init?: Partial<BoonFotoEntity>) {
    Object.assign(this, init);
  }
}
