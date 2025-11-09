import { Injectable } from '@nestjs/common';
import { isNil, omitBy } from 'lodash';
import { Transporter, createTransport } from 'nodemailer';
import type { DefaultOptions, SmtpConfig } from './constants/interfaces';
import type SMTPTransport = require('nodemailer/lib/smtp-transport');

@Injectable()
export class MailerTransporterFactory {
  async createTransport(
    smtpConfig: SmtpConfig,
    defaultOptions: DefaultOptions
  ): Promise<{ transport: Transporter; smtpConfig: SmtpConfig; defaultOptions: DefaultOptions }> {
    const transporterConfig: SMTPTransport.Options = {
      host: smtpConfig.server,
      port: smtpConfig.port,
      secure: smtpConfig.flagSsl,
      tls: {
        rejectUnauthorized: false,
      },
    };

    if (smtpConfig.username && smtpConfig.password)
      transporterConfig['auth'] = {
        user: smtpConfig.username,
        pass: smtpConfig.password,
      };

    const defaultsConfig: SMTPTransport.Options = omitBy(
      {
        from: defaultOptions?.mailFrom,
      },
      isNil
    );

    const transport = createTransport(transporterConfig, defaultsConfig);
    await transport.verify();

    return { transport, smtpConfig, defaultOptions };
  }
}
