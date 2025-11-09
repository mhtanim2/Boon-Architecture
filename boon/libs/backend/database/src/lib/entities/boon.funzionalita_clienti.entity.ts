import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BoonClientiEntity } from './boon.clienti.entity';
import { BoonFunzionalitaEntity } from './boon.funzionalita.entity';

@Entity('funzionalita_clienti', { schema: 'boon' })
export class BoonFunzionalitaClientiEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'id_funzionalita' })
  idFunzionalita: number;

  @Column('int', { name: 'id_cliente' })
  idCliente: number;

  @ManyToOne(() => BoonClientiEntity, (boonClientiEntity) => boonClientiEntity.funzionalitaClienti, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'id_cliente', referencedColumnName: 'id' }])
  cliente: BoonClientiEntity;

  @ManyToOne(() => BoonFunzionalitaEntity, (boonFunzionalitaEntity) => boonFunzionalitaEntity.funzionalitaClienti, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'id_funzionalita', referencedColumnName: 'id' }])
  funzionalita: BoonFunzionalitaEntity;

  constructor(init?: Partial<BoonFunzionalitaClientiEntity>) {
    Object.assign(this, init);
  }
}
