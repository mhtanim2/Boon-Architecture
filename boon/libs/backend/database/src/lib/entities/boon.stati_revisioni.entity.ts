import { Column, Entity, OneToMany } from 'typeorm';
import { BoonLogRevisioniEntity } from './boon.log_revisioni.entity';

@Entity('stati_revisioni', { schema: 'boon' })
export class BoonStatiRevisioniEntity {
  @Column('int', { primary: true, name: 'id' })
  id: number;

  @Column('varchar', { name: 'nome', length: 255 })
  nome: string;

  @Column('varchar', { name: 'descrizione', length: 255 })
  descrizione: string;

  @OneToMany(() => BoonLogRevisioniEntity, (boonLogRevisioniEntity) => boonLogRevisioniEntity.stato)
  logRevisioni: BoonLogRevisioniEntity[];

  constructor(init?: Partial<BoonStatiRevisioniEntity>) {
    Object.assign(this, init);
  }
}
