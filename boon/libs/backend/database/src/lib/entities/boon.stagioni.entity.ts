import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BoonStagioniClientiEntity } from './boon.stagioni_clienti.entity';

@Entity('stagioni', { schema: 'boon' })
export class BoonStagioniEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'codice', nullable: true })
  codice: number | null;

  @Column('varchar', { name: 'nome', nullable: true, length: 255 })
  nome: string | null;

  @OneToMany(() => BoonStagioniClientiEntity, (boonStagioniClientiEntity) => boonStagioniClientiEntity.stagione)
  stagioniClienti: BoonStagioniClientiEntity[];

  constructor(init?: Partial<BoonStagioniEntity>) {
    Object.assign(this, init);
  }
}
