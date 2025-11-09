import { Column, Entity, OneToMany } from 'typeorm';
import { boolTinyIntTransformer } from '../utils';
import { BoonTemplateClientiEntity } from './boon.template_clienti.entity';

@Entity('stati_template', { schema: 'boon' })
export class BoonStatiTemplateEntity {
  @Column('int', { primary: true, name: 'id' })
  id: number;

  @Column('varchar', { name: 'nome', length: 255 })
  nome: string;

  @Column('varchar', { name: 'descrizione', length: 255 })
  descrizione: string;

  @Column('tinyint', {
    name: 'flag_abilitato',
    width: 1,
    default: () => "'0'",
    transformer: boolTinyIntTransformer,
  })
  flagAbilitato: boolean;

  @OneToMany(() => BoonTemplateClientiEntity, (boonTemplateClientiEntity) => boonTemplateClientiEntity.stato)
  templateClienti: BoonTemplateClientiEntity[];

  constructor(init?: Partial<BoonStatiTemplateEntity>) {
    Object.assign(this, init);
  }
}
