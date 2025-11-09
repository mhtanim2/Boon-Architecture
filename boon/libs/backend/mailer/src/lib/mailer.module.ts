import { Global, Module } from '@nestjs/common';
import { MailerTransporterFactory } from './mailer-transporter-factory';
import { ConfigurableMailerModule } from './mailer.module-definition';
import { MailerService } from './mailer.service';

@Global()
@Module({
  providers: [MailerService, MailerTransporterFactory],
  exports: [MailerService],
})
export class MailerModule extends ConfigurableMailerModule {}
