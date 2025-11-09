import { Column, Entity } from 'typeorm';

@Entity('parametri', { schema: 'boon' })
export class BoonParametriEntity {
  @Column('varchar', { primary: true, name: 'nome', length: 255 })
  nome: string;

  @Column('json', { name: 'valore' })
  valore: unknown;

  constructor(init?: Partial<BoonParametriEntity>) {
    Object.assign(this, init);
  }
}
