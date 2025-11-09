import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BoonAccountsEntity } from './boon.accounts.entity';
import { BoonClientiEntity } from './boon.clienti.entity';

@Entity('accounts_clienti', { schema: 'boon' })
export class BoonAccountsClientiEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'id_account' })
  idAccount: number;

  @Column('int', { name: 'id_cliente' })
  idCliente: number;

  @ManyToOne(() => BoonAccountsEntity, (boonAccountsEntity) => boonAccountsEntity.accountsClienti, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
    orphanedRowAction: 'delete',
  })
  @JoinColumn([{ name: 'id_account', referencedColumnName: 'id' }])
  account: BoonAccountsEntity;

  @ManyToOne(() => BoonClientiEntity, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'id_cliente', referencedColumnName: 'id' }])
  cliente: BoonClientiEntity;

  constructor(init?: Partial<BoonAccountsClientiEntity>) {
    Object.assign(this, init);
  }
}
