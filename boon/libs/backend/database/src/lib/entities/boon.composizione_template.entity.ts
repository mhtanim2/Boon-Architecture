import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BoonTemplateClientiEntity } from './boon.template_clienti.entity';
import { boolTinyIntTransformer } from '../utils';

@Entity('composizione_template', { schema: 'boon' })
export class BoonComposizioneTemplateEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'id_template' })
  idTemplate: number;

  @Column('varchar', { name: 'nome_colonna', length: 255 })
  nomeColonna: string;

  @Column('varchar', { name: 'tipo_dati', length: 80 })
  tipoDati: string;

  @Column('int', { name: 'lunghezza_massima', nullable: true })
  lunghezzaMassima: number | null;

  @Column('tinyint', { name: 'flag_richiesto', transformer: boolTinyIntTransformer })
  flagRichiesto: boolean;

  @Column('varchar', { name: 'regola', nullable: true, length: 80 })
  regola: string | null;

  @Column('int', { name: 'posizione' })
  posizione: number;

  @Column('varchar', { name: 'data_match', nullable: true, length: 80 })
  dataMatch: string | null;

  @ManyToOne(() => BoonTemplateClientiEntity, (boonTemplateClientiEntity) => boonTemplateClientiEntity.composizione, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'id_template', referencedColumnName: 'id' }])
  template: BoonTemplateClientiEntity;

  constructor(init?: Partial<BoonComposizioneTemplateEntity>) {
    Object.assign(this, init);
  }
}
