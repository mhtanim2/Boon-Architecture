import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BoonAccountsEntity } from './boon.accounts.entity';
import { BoonTemplateClientiEntity } from './boon.template_clienti.entity';

@Entity('file_upload', { schema: 'boon' })
export class BoonFileUploadEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'id_template' })
  idTemplate: number;

  @Column('int', { name: 'id_account' })
  idUploader: number;

  @Column('datetime', { name: 'data_ora', default: () => 'CURRENT_TIMESTAMP' })
  dataOra: Date;

  @Column('datetime', { name: 'ultima_modifica', default: () => 'CURRENT_TIMESTAMP' })
  ultimaModifica: Date;

  @Column('varchar', { name: 'nome_file', length: 255 })
  nomeFile: string;

  @Column('varchar', { name: 'url', length: 255 })
  url: string;

  @Column('int', { name: 'dimensione', unsigned: true })
  dimensione: number;

  @DeleteDateColumn({ type: 'datetime', name: 'archiviato_il', nullable: true })
  archiviatoIl: Date | null;

  @ManyToOne(() => BoonAccountsEntity, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'id_account', referencedColumnName: 'id' }])
  uploader: BoonAccountsEntity;

  @ManyToOne(() => BoonTemplateClientiEntity, (boonTemplateClientiEntity) => boonTemplateClientiEntity.fileUploads, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'id_template', referencedColumnName: 'id' }])
  template: BoonTemplateClientiEntity;

  constructor(init?: Partial<BoonFileUploadEntity>) {
    Object.assign(this, init);
  }
}
