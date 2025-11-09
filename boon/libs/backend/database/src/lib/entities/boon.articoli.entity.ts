import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BoonClientiEntity } from './boon.clienti.entity';
import { BoonFotoEntity } from './boon.foto.entity';
import { BoonGeneriEntity } from './boon.generi.entity';
import { BoonRevisioniEntity } from './boon.revisioni.entity';
import { BoonSpecificheArticoliEntity } from './boon.specifiche_articoli.entity';
import { BoonStagioniClientiEntity } from './boon.stagioni_clienti.entity';
import { BoonStatiArticoliEntity } from './boon.stati_articoli.entity';

@Entity('articoli', { schema: 'boon' })
export class BoonArticoliEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'id_cliente' })
  idCliente: number;

  @Column('int', { name: 'id_stato' })
  idStato: number;

  @Column('int', { name: 'id_genere' })
  idGenere: number;

  @Column('int', { name: 'id_stagione_cliente' })
  idStagioneCliente: number;

  @Column('varchar', { name: 'codice', length: 255 })
  codice: string;

  @Column('int', { name: 'versione', default: () => "'0'" })
  versione: number;

  @Column('varchar', { name: 'nome', length: 255 })
  nome: string;

  @Column('varchar', { name: 'divisione', nullable: true, length: 255 })
  divisione: string | null;

  @Column('varchar', { name: 'colore', nullable: true, length: 255 })
  colore: string | null;

  // @Column('varchar', { name: 'genere', nullable: true, length: 255 })
  // genere: string | null;

  @Column('varchar', { name: 'emea', nullable: true, length: 255 })
  emea: string | null;

  @Column('varchar', { name: 'brand', nullable: true, length: 255 })
  brand: string | null;

  @Column('varchar', { name: 'info_shooting', nullable: true, length: 255 })
  infoShooting: string | null;

  @Column('tinyint', { name: 'flag_dms', nullable: true, default: () => "'0'" })
  flagDms: number | null;

  @Column('varchar', { name: 'ecs', nullable: true, length: 255 })
  ecs: string | null;

  @Column('varchar', { name: 'note', nullable: true, length: 255 })
  note: string | null;

  @ManyToOne(() => BoonClientiEntity, (boonClientiEntity) => boonClientiEntity.articoli, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'id_cliente', referencedColumnName: 'id' }])
  cliente: BoonClientiEntity;

  @ManyToOne(() => BoonGeneriEntity, (boonGeneriEntity) => boonGeneriEntity.articoli, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'id_genere', referencedColumnName: 'id' }])
  genere: BoonGeneriEntity;

  @ManyToOne(() => BoonStatiArticoliEntity, (boonStatiArticoliEntity) => boonStatiArticoliEntity.articoli, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'id_stato', referencedColumnName: 'id' }])
  stato: BoonStatiArticoliEntity;

  @ManyToOne(() => BoonStagioniClientiEntity, (boonStagioniClientiEntity) => boonStagioniClientiEntity.articoli, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'id_stagione_cliente', referencedColumnName: 'id' }])
  stagioneCliente: BoonStagioniClientiEntity;

  @OneToMany(() => BoonFotoEntity, (boonFotoEntity) => boonFotoEntity.articolo)
  foto: BoonFotoEntity[];

  @OneToMany(() => BoonRevisioniEntity, (boonRevisioniEntity) => boonRevisioniEntity.articolo)
  revisioni: BoonRevisioniEntity[];

  @OneToMany(
    () => BoonSpecificheArticoliEntity,
    (boonSpecificheArticoliEntity) => boonSpecificheArticoliEntity.articolo
  )
  specificheArticoli: BoonSpecificheArticoliEntity[];

  constructor(init?: Partial<BoonArticoliEntity>) {
    Object.assign(this, init);
  }
}
