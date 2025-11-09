import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BoonClientiEntity } from './boon.clienti.entity';
import { BoonFunzionalitaEntity } from './boon.funzionalita.entity';
import { BoonLivelliPrivilegiEntity } from './boon.livelli_privilegi.entity';
import { BoonRuoliEntity } from './boon.ruoli.entity';

@Entity('privilegi', { schema: 'boon' })
export class BoonPrivilegiEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'id_funzionalita' })
  idFunzionalita: number;

  @Column('int', { name: 'id_ruolo' })
  idRuolo: number;

  @Column('int', { name: 'id_livello', default: () => "'0'" })
  idLivello: number;

  @Column('int', { name: 'id_cliente' })
  idCliente: number;

  @ManyToOne(() => BoonClientiEntity, (boonClientiEntity) => boonClientiEntity.privilegi, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'id_cliente', referencedColumnName: 'id' }])
  cliente: BoonClientiEntity;

  @ManyToOne(() => BoonFunzionalitaEntity, (boonFunzionalitaEntity) => boonFunzionalitaEntity.privilegi, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'id_funzionalita', referencedColumnName: 'id' }])
  funzionalita: BoonFunzionalitaEntity;

  @ManyToOne(() => BoonLivelliPrivilegiEntity, (boonLivelliPrivilegiEntity) => boonLivelliPrivilegiEntity.privilegi, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'id_livello', referencedColumnName: 'id' }])
  livello: BoonLivelliPrivilegiEntity;

  @ManyToOne(() => BoonRuoliEntity, (boonRuoliEntity) => boonRuoliEntity.privilegi, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'id_ruolo', referencedColumnName: 'id' }])
  ruolo: BoonRuoliEntity;

  constructor(init?: Partial<BoonPrivilegiEntity>) {
    Object.assign(this, init);
  }
}
