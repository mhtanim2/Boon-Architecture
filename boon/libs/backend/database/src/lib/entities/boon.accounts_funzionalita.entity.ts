import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { boolTinyIntTransformer } from '../utils';
import { BoonAccountsEntity } from './boon.accounts.entity';
import { BoonClientiEntity } from './boon.clienti.entity';
import { BoonFunzionalitaEntity } from './boon.funzionalita.entity';
import { BoonLivelliPrivilegiEntity } from './boon.livelli_privilegi.entity';

@Entity('accounts_funzionalita', { schema: 'boon' })
export class BoonAccountsFunzionalitaEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'id_account' })
  idAccount: number;

  @Column('int', { name: 'id_funzionalita' })
  idFunzionalita: number;

  @Column('tinyint', { name: 'flag_abilitata', width: 1, transformer: boolTinyIntTransformer })
  flagAbilitata: boolean;

  @Column('int', { name: 'id_cliente' })
  idCliente: number;

  @Column('int', { name: 'id_livello' })
  idLivello: number;

  @ManyToOne(() => BoonAccountsEntity, (boonAccountsEntity) => boonAccountsEntity.accountsFunzionalita, {
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

  @ManyToOne(() => BoonFunzionalitaEntity, (boonFunzionalitaEntity) => boonFunzionalitaEntity.accountsFunzionalita, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'id_funzionalita', referencedColumnName: 'id' }])
  funzionalita: BoonFunzionalitaEntity;

  @ManyToOne(
    () => BoonLivelliPrivilegiEntity,
    (boonLivelliPrivilegiEntity) => boonLivelliPrivilegiEntity.accountsFunzionalita,
    { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' }
  )
  @JoinColumn([{ name: 'id_livello', referencedColumnName: 'id' }])
  livello: BoonLivelliPrivilegiEntity;

  constructor(init?: Partial<BoonAccountsFunzionalitaEntity>) {
    Object.assign(this, init);
  }
}
