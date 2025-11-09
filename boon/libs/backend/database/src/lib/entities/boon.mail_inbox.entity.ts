import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { boolTinyIntTransformer } from '../utils';

@Entity('mail_inbox', { schema: 'boon' })
export class BoonMailInboxEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'guid', length: 255 })
  guid: string;

  @Column('varchar', { name: 'from', length: 255 })
  from: string;

  @Column('json', { name: 'to' })
  to: any[];

  @Column('json', { name: 'cc' })
  cc: any[];

  @Column('json', { name: 'bcc' })
  bcc: any[];

  @Column('varchar', { name: 'subject', length: 255 })
  subject: string;

  @Column('longtext', { name: 'html' })
  html: string;

  @Column('longtext', { name: 'plain' })
  plain: string;

  @Column('json', { name: 'attachments' })
  attachments: any[];

  @Column('datetime', { name: 'created_at' })
  createdAt: Date;

  @Column('tinyint', { name: 'is_successful', width: 1, transformer: boolTinyIntTransformer })
  isSuccessful: boolean;

  @Column('smallint', { name: 'retries', default: () => "'0'" })
  retries: number;

  @Column('datetime', { name: 'completed_at', nullable: true })
  completedAt: Date | null;

  @Column('json', { name: 'last_error', nullable: true })
  lastError: object | null;

  @Column('datetime', { name: 'last_error_at', nullable: true })
  lastErrorAt: Date | null;

  @Column('json', { name: 'context', nullable: true })
  context: any | null;

  @Column('varchar', { name: 'template_content', nullable: true, length: 50 })
  templateContent: string | null;

  @Column('longtext', { name: 'template_compiled', nullable: true })
  templateCompiled: string | null;

  constructor(init?: Partial<BoonMailInboxEntity>) {
    Object.assign(this, init);
  }
}
