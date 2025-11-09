import { ConfigurableModuleBuilder } from '@nestjs/common';
import { MailerConfig } from './constants';

export const { ConfigurableModuleClass: ConfigurableMailerModule, MODULE_OPTIONS_TOKEN: MAILER_CONFIG_OPTIONS } =
  new ConfigurableModuleBuilder<MailerConfig>().build();
