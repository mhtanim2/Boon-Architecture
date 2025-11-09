import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BoonClientiEntity } from './boon.clienti.entity';

@Entity('tenants', { schema: 'boon' })
export class BoonTenantsEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'id_cliente' })
  idCliente: number;

  @Column('varchar', { name: 'slug', unique: true, length: 255 })
  slug: string;

  @Column('text', { name: 'logo', nullable: true })
  logo: string | null;

  @ManyToOne(() => BoonClientiEntity, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'id_cliente', referencedColumnName: 'id' }])
  cliente: BoonClientiEntity;

  constructor(init?: Partial<BoonTenantsEntity>) {
    Object.assign(this, init);
  }
}
