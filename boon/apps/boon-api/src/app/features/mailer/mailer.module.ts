import { BOON_DATASOURCE } from '@boon/backend/database';
import { BoonMailInboxEntity } from '@boon/backend/database/entities/boon';
import { MailerModule as LibMailerModule } from '@boon/backend/mailer';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParametersModule } from '../parameters/parameters.module';
import { MailerController } from './mailer.controller';
import { MailerInboxProcessor } from './mailer.inbox.processor';
import { MailerInboxService } from './mailer.inbox.service';
import { MailerService } from './mailer.service';
import { MailerTransportConfigurationRetriever } from './mailer.transport-configuration-retriever';

@Module({
  imports: [
    TypeOrmModule.forFeature([BoonMailInboxEntity], BOON_DATASOURCE),
    ParametersModule,
    LibMailerModule.registerAsync({
      useFactory: async (retriever: MailerTransportConfigurationRetriever) => {
        return await retriever.retrieveConfig();
      },
      imports: [MailerModule],
      inject: [MailerTransportConfigurationRetriever],
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [MailerController],
  providers: [MailerService, MailerInboxProcessor, MailerInboxService, MailerTransportConfigurationRetriever],
  exports: [MailerInboxService, MailerTransportConfigurationRetriever],
})
export class MailerModule {}
