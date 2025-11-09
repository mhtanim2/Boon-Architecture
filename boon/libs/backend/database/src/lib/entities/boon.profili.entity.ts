import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BoonAccountsEntity } from './boon.accounts.entity';
import { BoonRuoliEntity } from './boon.ruoli.entity';

@Entity('profili', { schema: 'boon' })
export class BoonProfiliEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'id_account' })
  idAccount: number;

  @Column('int', { name: 'id_ruolo' })
  idRuolo: number;

  @ManyToOne(() => BoonAccountsEntity, (boonAccountsEntity) => boonAccountsEntity.profili, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
    orphanedRowAction: 'delete',
  })
  @JoinColumn([{ name: 'id_account', referencedColumnName: 'id' }])
  account: BoonAccountsEntity;

  @ManyToOne(() => BoonRuoliEntity, (boonRuoliEntity) => boonRuoliEntity.profili, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'id_ruolo', referencedColumnName: 'id' }])
  ruolo: BoonRuoliEntity;

  constructor(init?: Partial<BoonProfiliEntity>) {
    Object.assign(this, init);
  }
}
