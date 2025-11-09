import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BoonClientiEntity } from './boon.clienti.entity';
import { BoonFileUploadEntity } from './boon.file_upload.entity';
import { BoonStatiTemplateEntity } from './boon.stati_template.entity';
import { BoonComposizioneTemplateEntity } from './boon.composizione_template.entity';
import { BoonFunzionalitaEntity } from './boon.funzionalita.entity';

@Entity('template_clienti', { schema: 'boon' })
export class BoonTemplateClientiEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'id_cliente' })
  idCliente: number;

  @Column('int', { name: 'id_stato', default: () => "'0'" })
  idStato: number;

  @Column('int', { name: 'id_funzionalita' })
  idFunzionalita: number;

  @Column('varchar', { name: 'url', length: 255 })
  nome: string;

  @OneToMany(() => BoonFileUploadEntity, (boonFileUploadEntity) => boonFileUploadEntity.template)
  fileUploads: BoonFileUploadEntity[];

  @ManyToOne(() => BoonClientiEntity, (boonClientiEntity) => boonClientiEntity.templateClienti, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'id_cliente', referencedColumnName: 'id' }])
  cliente: BoonClientiEntity;

  @ManyToOne(() => BoonStatiTemplateEntity, (boonStatiTemplateEntity) => boonStatiTemplateEntity.templateClienti, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'id_stato', referencedColumnName: 'id' }])
  stato: BoonStatiTemplateEntity;

  @ManyToOne(() => BoonFunzionalitaEntity, (boonFunzionalitaEntity) => boonFunzionalitaEntity.templates, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'id_funzionalita', referencedColumnName: 'id' }])
  funzionalita: BoonFunzionalitaEntity;

  @OneToMany(
    () => BoonComposizioneTemplateEntity,
    (boonComposizioneTemplateEntity) => boonComposizioneTemplateEntity.template
  )
  composizione: BoonComposizioneTemplateEntity[];

  constructor(init?: Partial<BoonTemplateClientiEntity>) {
    Object.assign(this, init);
  }
}
