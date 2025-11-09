import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BoonArticoliEntity } from './boon.articoli.entity';
import { BoonClientiEntity } from './boon.clienti.entity';
import { BoonStagioniEntity } from './boon.stagioni.entity';

@Entity('stagioni_clienti', { schema: 'boon' })
export class BoonStagioniClientiEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'id_stagione', nullable: true })
  idStagione: number | null;

  @Column('int', { name: 'id_cliente', nullable: true })
  idCliente: number | null;

  @Column('varchar', { name: 'codice', nullable: true, length: 80 })
  codice: string | null;

  @Column('varchar', { name: 'nome', nullable: true, length: 255 })
  nome: string | null;

  @OneToMany(() => BoonArticoliEntity, (boonArticoliEntity) => boonArticoliEntity.stagioneCliente)
  articoli: BoonArticoliEntity[];

  @ManyToOne(() => BoonClientiEntity, (boonClientiEntity) => boonClientiEntity.stagioniClienti, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'id_cliente', referencedColumnName: 'id' }])
  cliente: BoonClientiEntity;

  @ManyToOne(() => BoonStagioniEntity, (boonStagioniEntity) => boonStagioniEntity.stagioniClienti, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'id_stagione', referencedColumnName: 'id' }])
  stagione: BoonStagioniEntity;

  constructor(init?: Partial<BoonStagioniClientiEntity>) {
    Object.assign(this, init);
  }
}
