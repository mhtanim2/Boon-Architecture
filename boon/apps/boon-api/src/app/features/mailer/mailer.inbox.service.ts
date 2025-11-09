import { BOON_DATASOURCE } from '@boon/backend/database';
import { BoonMailInboxEntity } from '@boon/backend/database/entities/boon';
import { TemplatedMailContent, isTemplatedEmail } from '@boon/backend/mailer';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { nanoid } from 'nanoid';
import * as Mail from 'nodemailer/lib/mailer';
import { Attachment } from 'nodemailer/lib/mailer';
import { Repository } from 'typeorm';
import { runInTransaction } from 'typeorm-transactional';

@Injectable()
export class MailerInboxService {
  constructor(
    @InjectRepository(BoonMailInboxEntity, BOON_DATASOURCE)
    private readonly mailInboxRepository: Repository<BoonMailInboxEntity>
  ) {}

  async addToInbox(
    mail: Mail.Options & TemplatedMailContent,
    attachments: Attachment[] = []
  ): Promise<BoonMailInboxEntity | null> {
    const now = new Date();
    const guid = `mail_${nanoid()}`;

    const countByGuid = await this.mailInboxRepository.countBy({ guid });
    if (countByGuid > 0) {
      return null;
    }

    const entity: BoonMailInboxEntity = this.mailInboxRepository.create({
      guid: guid,
      from: mail.from ?? '',
      to: (mail.to as string[]) ?? [],
      cc: (mail.cc as string[]) ?? [],
      bcc: (mail.bcc as string[]) ?? [],
      subject: mail.subject ?? '',
      attachments: attachments,
      context: isTemplatedEmail(mail) ? mail.context : null,
      templateContent: isTemplatedEmail(mail) ? mail.contentTemplateName : null,
      templateCompiled: null,
      plain: '',
      createdAt: now,
      completedAt: null,
      isSuccessful: false,
      error: undefined,
      html: '',
    } as Partial<BoonMailInboxEntity>);
    const row = await this.mailInboxRepository.save(entity);

    return row;
  }

  async retrieveEventsFromInbox(): Promise<BoonMailInboxEntity[]> {
    return await runInTransaction(
      async () => {
        const rows = this.mailInboxRepository
          .createQueryBuilder('mail')
          .where('mail.completedAt IS NULL')
          .andWhere('mail.retries < :maxRetries', { maxRetries: 3 })
          .orderBy('mail.createdAt', 'ASC')
          .limit(10)
          .setLock('pessimistic_partial_write')
          .setOnLocked('skip_locked')
          .getMany();

        return rows;
      },
      { connectionName: BOON_DATASOURCE }
    );
  }

  async markEventAsCompleted(
    row: BoonMailInboxEntity,
    mail: Mail.Options,
    compiledTemplate: string | undefined,
    completedAt: Date
  ): Promise<{ rowCount: number | undefined }> {
    return await runInTransaction(
      async () => {
        const update = await this.mailInboxRepository.update(row.id, {
          from: mail.from?.toString(),
          html: mail.html?.toString(),
          plain: mail.text?.toString(),
          templateCompiled: compiledTemplate,
          isSuccessful: true,
          completedAt: completedAt,
        });
        return { rowCount: update.affected };
      },
      { connectionName: BOON_DATASOURCE }
    );
  }

  async markEventAsErrored<E extends object>(
    row: BoonMailInboxEntity,
    error: E,
    errorAt: Date,
    mail?: Mail.Options,
    compiledTemplate?: string | undefined
  ): Promise<{ rowCount: number | undefined }> {
    return await runInTransaction(
      async () => {
        const update = await this.mailInboxRepository.update(row.id, {
          retries: () => 'retries + 1',
          from: mail?.from?.toString(),
          html: mail?.html?.toString(),
          plain: mail?.text?.toString(),
          templateCompiled: compiledTemplate,
          isSuccessful: false,
          lastError: error,
          lastErrorAt: errorAt,
        });
        return { rowCount: update.affected };
      },
      { connectionName: BOON_DATASOURCE }
    );
  }
}
