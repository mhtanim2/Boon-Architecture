import { Column, Entity, OneToMany } from 'typeorm';
import { BoonAccountsFunzionalitaEntity } from './boon.accounts_funzionalita.entity';
import { BoonPrivilegiEntity } from './boon.privilegi.entity';

@Entity('livelli_privilegi', { schema: 'boon' })
export class BoonLivelliPrivilegiEntity {
  @Column('int', { primary: true, name: 'id' })
  id: number;

  @Column('varchar', { name: 'nome', length: 255 })
  nome: string;

  @Column('varchar', { name: 'descrizione', length: 255 })
  descrizione: string;

  @OneToMany(
    () => BoonAccountsFunzionalitaEntity,
    (boonAccountsFunzionalitaEntity) => boonAccountsFunzionalitaEntity.livello
  )
  accountsFunzionalita: BoonAccountsFunzionalitaEntity[];

  @OneToMany(() => BoonPrivilegiEntity, (boonPrivilegiEntity) => boonPrivilegiEntity.livello)
  privilegi: BoonPrivilegiEntity[];

  constructor(init?: Partial<BoonLivelliPrivilegiEntity>) {
    Object.assign(this, init);
  }
}
