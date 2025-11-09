import { BoonMailInboxEntity } from '@boon/backend/database/entities/boon';
import { MailerService as LibMailerService, MailContent } from '@boon/backend/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { isEmpty } from 'lodash';
import * as Mail from 'nodemailer/lib/mailer';
import { MailerTransportConfigurationRetriever } from './mailer.transport-configuration-retriever';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);

  constructor(
    private readonly mailerService: LibMailerService,
    private readonly transportConfigurationRetriver: MailerTransportConfigurationRetriever
  ) {}

  async sendMail(row: BoonMailInboxEntity, attachments: Mail.Attachment[]) {
    const { from, to, cc, bcc, subject, templateContent, context } = row;
    const mailOptions: Mail.Options & MailContent = {
      from: !isEmpty(from) ? from : undefined,
      to,
      cc,
      bcc,
      subject,
      baseTemplateName: 'base',
      contentTemplateName: templateContent ?? '',
      context,
    };

    const config = await this.transportConfigurationRetriver.retrieveConfig();
    await this.mailerService.updateTransportConfig(config);
    const { mail, compiledTemplate, info, err } = await this.mailerService.sendMail(mailOptions, attachments);

    if (err) this.logger.error(err);
    if (info) this.logger.log(info);

    return { mail, compiledTemplate, info, err };
  }
}
