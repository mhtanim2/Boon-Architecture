import { Column, Entity, OneToMany } from 'typeorm';
import { BoonAccountsFunzionalitaEntity } from './boon.accounts_funzionalita.entity';
import { BoonFunzionalitaClientiEntity } from './boon.funzionalita_clienti.entity';
import { BoonPrivilegiEntity } from './boon.privilegi.entity';
import { BoonTemplateClientiEntity } from './boon.template_clienti.entity';
import { boolTinyIntTransformer } from '../utils';

@Entity('funzionalita', { schema: 'boon' })
export class BoonFunzionalitaEntity {
  @Column('int', { primary: true, name: 'id' })
  id: number;

  @Column('varchar', { name: 'nome', length: 255 })
  nome: string;

  @Column('varchar', { name: 'descrizione', length: 255 })
  descrizione: string;

  @Column('tinyint', { name: 'flag_specifica', default: () => "'0'", transformer: boolTinyIntTransformer })
  flagSpecifica: boolean;

  @OneToMany(
    () => BoonAccountsFunzionalitaEntity,
    (boonAccountsFunzionalitaEntity) => boonAccountsFunzionalitaEntity.funzionalita
  )
  accountsFunzionalita: BoonAccountsFunzionalitaEntity[];

  @OneToMany(
    () => BoonFunzionalitaClientiEntity,
    (boonFunzionalitaClientiEntity) => boonFunzionalitaClientiEntity.funzionalita
  )
  funzionalitaClienti: BoonFunzionalitaClientiEntity[];

  @OneToMany(() => BoonPrivilegiEntity, (boonPrivilegiEntity) => boonPrivilegiEntity.funzionalita)
  privilegi: BoonPrivilegiEntity[];

  @OneToMany(
    () => BoonTemplateClientiEntity,
    (boonTemplateClientiEntity) => boonTemplateClientiEntity.funzionalita
  )
  templates: BoonTemplateClientiEntity[];

  constructor(init?: Partial<BoonFunzionalitaEntity>) {
    Object.assign(this, init);
  }
}
