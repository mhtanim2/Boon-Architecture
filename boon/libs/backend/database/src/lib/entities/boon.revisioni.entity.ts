import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BoonArticoliEntity } from './boon.articoli.entity';
import { BoonFotoEntity } from './boon.foto.entity';
import { BoonLogRevisioniEntity } from './boon.log_revisioni.entity';

@Entity('revisioni', { schema: 'boon' })
export class BoonRevisioniEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'id_articolo', nullable: true })
  idArticolo: number | null;

  @Column('int', { name: 'id_foto', nullable: true })
  idFoto: number | null;

  @OneToMany(() => BoonLogRevisioniEntity, (boonLogRevisioniEntity) => boonLogRevisioniEntity.revisione)
  logRevisioni: BoonLogRevisioniEntity[];

  @ManyToOne(() => BoonArticoliEntity, (boonArticoliEntity) => boonArticoliEntity.revisioni, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'id_articolo', referencedColumnName: 'id' }])
  articolo: BoonArticoliEntity;

  @ManyToOne(() => BoonFotoEntity, (boonFotoEntity) => boonFotoEntity.revisioni, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'id_foto', referencedColumnName: 'id' }])
  foto: BoonFotoEntity;

  constructor(init?: Partial<BoonRevisioniEntity>) {
    Object.assign(this, init);
  }
}
