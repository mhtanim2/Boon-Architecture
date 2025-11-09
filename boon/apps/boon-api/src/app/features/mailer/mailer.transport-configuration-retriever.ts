import { MailerConfig, mailerSchema } from '@boon/backend/mailer';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ParametersService } from '../parameters/parameters.service';

@Injectable()
export class MailerTransportConfigurationRetriever {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly parametersService: ParametersService
  ) {}

  async retrieveConfig(): Promise<MailerConfig> {
    const CACHE_KEY = 'MailerConfig';
    const CACHE_TTL = 60;

    let config = await this.cacheManager.get<MailerConfig | undefined>(CACHE_KEY);
    if (!config) {
      config ??= await this.retrieveConfigFromDatabase();
      await this.cacheManager.set(CACHE_KEY, CACHE_TTL);
    }
    return config;
  }

  private async retrieveConfigFromDatabase(): Promise<MailerConfig> {
    const rawConfig = await this.parametersService.retrieveConfigFromDatabase('MAILER_');
    const config = mailerSchema.parse({
      smtp: {
        server: rawConfig['MAILER_SMTP_SERVER'],
        username: rawConfig['MAILER_SMTP_USERNAME'],
        password: rawConfig['MAILER_SMTP_PASSWORD'],
        port: rawConfig['MAILER_SMTP_PORT'],
        flagSsl: rawConfig['MAILER_SMTP_FLAG_SSL'],
      },
      defaultOptions: {
        mailFrom: rawConfig['MAILER_DEFAULT_MAIL_FROM'],
      },
      context: {},
    });
    return config;
  }
}
