import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BoonAccountsEntity } from './boon.accounts.entity';
import { BoonRevisioniEntity } from './boon.revisioni.entity';
import { BoonStatiRevisioniEntity } from './boon.stati_revisioni.entity';

@Entity('log_revisioni', { schema: 'boon' })
export class BoonLogRevisioniEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'id_revisione' })
  idRevisione: number;

  @Column('int', { name: 'id_stato' })
  idStato: number;

  @Column('int', { name: 'id_account' })
  idAccount: number;

  @Column('timestamp', { name: 'ts', nullable: true })
  ts: Date | null;

  @Column('varchar', { name: 'note', nullable: true, length: 255 })
  note: string | null;

  @ManyToOne(() => BoonAccountsEntity, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'id_account', referencedColumnName: 'id' }])
  account: BoonAccountsEntity;

  @ManyToOne(() => BoonRevisioniEntity, (boonRevisioniEntity) => boonRevisioniEntity.logRevisioni, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'id_revisione', referencedColumnName: 'id' }])
  revisione: BoonRevisioniEntity;

  @ManyToOne(() => BoonStatiRevisioniEntity, (boonStatiRevisioniEntity) => boonStatiRevisioniEntity.logRevisioni, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'id_stato', referencedColumnName: 'id' }])
  stato: BoonStatiRevisioniEntity;

  constructor(init?: Partial<BoonLogRevisioniEntity>) {
    Object.assign(this, init);
  }
}
