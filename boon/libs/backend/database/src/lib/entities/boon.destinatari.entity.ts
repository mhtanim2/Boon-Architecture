import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BoonClientiEntity } from './boon.clienti.entity';

@Entity('destinatari', { schema: 'boon' })
export class BoonDestinatariEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'id_cliente', default: () => "'0'" })
  idCliente: number;

  @Column('varchar', { name: 'nome', length: 255 })
  nome: string;

  @Column('varchar', { name: 'e_mail', length: 255 })
  eMail: string;

  @ManyToOne(() => BoonClientiEntity, (boonClientiEntity) => boonClientiEntity.destinatari, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'id_cliente', referencedColumnName: 'id' }])
  cliente: BoonClientiEntity;

  constructor(init?: Partial<BoonDestinatariEntity>) {
    Object.assign(this, init);
  }
}
