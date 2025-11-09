import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { MailerInboxService } from './mailer.inbox.service';
import { MailerService } from './mailer.service';

const POLLING_INTERVAL_IN_MS = 5000;

@Injectable()
export class MailerInboxProcessor {
  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly mailerInboxService: MailerInboxService,
    private readonly mailerService: MailerService
  ) {
    if (POLLING_INTERVAL_IN_MS > 0) {
      const job = setInterval(() => this.handleCron(), POLLING_INTERVAL_IN_MS);
      const jobName = MailerInboxProcessor.name + '.' + MailerInboxProcessor.prototype.handleCron.name;
      this.schedulerRegistry.addInterval(jobName, job);
    }
  }

  async handleCron() {
    const events = await this.mailerInboxService.retrieveEventsFromInbox();
    for (const event of events) {
      try {
        const { mail, compiledTemplate, info, err } = await this.mailerService.sendMail(event, event.attachments);
        const now = new Date();

        if (!err) {
          await this.mailerInboxService.markEventAsCompleted(event, mail, compiledTemplate, now);
        } else {
          await this.mailerInboxService.markEventAsErrored(event, err, now, mail, compiledTemplate);
        }
      } catch (err: any) {
        const now = new Date();
        await this.mailerInboxService.markEventAsErrored(event, err, now);
      }
    }
  }
}
