import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BoonGeneriEntity } from './boon.generi.entity';

@Entity('generi_alias', { schema: 'boon' })
export class BoonGeneriAliasEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'id_genere' })
  idGenere: number;

  @Column('varchar', { name: 'alias', nullable: true, length: 255 })
  alias: string | null;

  @ManyToOne(() => BoonGeneriEntity, (boonGeneriEntity) => boonGeneriEntity.alias, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
    orphanedRowAction: 'delete',
  })
  @JoinColumn([{ name: 'id_genere', referencedColumnName: 'id' }])
  genere: BoonGeneriEntity;

  constructor(init?: Partial<BoonGeneriAliasEntity>) {
    Object.assign(this, init);
  }
}
