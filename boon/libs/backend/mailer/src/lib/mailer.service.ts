import { BadRequestException, Inject } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as handlebars from 'handlebars';
import { convert as html2text } from 'html-to-text';
import { isEqual, omit } from 'lodash';
import * as path from 'path';
import { MailerConfig, isTemplatedEmail } from './constants';
import { CachedTransporter, MailContent, SentMailInfo, TemplatedMailContent } from './constants/interfaces';
import { MailerTransporterFactory } from './mailer-transporter-factory';
import { MAILER_CONFIG_OPTIONS } from './mailer.module-definition';

import type Mail = require('nodemailer/lib/mailer');
import mjml2html = require('mjml');

export class MailerService {
  private cachedTransporter: CachedTransporter;

  constructor(
    @Inject(MAILER_CONFIG_OPTIONS) private readonly mailerConfig: MailerConfig,
    private readonly mailerTransporterFactory: MailerTransporterFactory
  ) {}

  async updateTransportConfig(newConfig: MailerConfig) {
    Object.assign(this.mailerConfig, newConfig);
  }

  async sendMail(mailOptions: Mail.Options & MailContent, attachments: Mail.Attachment[] = []): Promise<SentMailInfo> {
    const { transport, context, defaultOptions } = await this.getOrCreateTransport();

    const res: SentMailInfo = {
      mail: mailOptions,
      defaultOptions: defaultOptions,
      compiledTemplate: undefined,
      info: undefined,
      err: undefined,
    };

    try {
      if (!defaultOptions?.mailFrom && !mailOptions.from) {
        throw new BadRequestException(`No sender provided in request; default sender not configured.`);
      }
      mailOptions.from ??= defaultOptions?.mailFrom;

      if (isTemplatedEmail(mailOptions)) {
        const { template, html } = await this.compileTemplate(mailOptions, context);
        mailOptions.html = html;
        res.compiledTemplate = template;
      }

      mailOptions.text = html2text(mailOptions.html as string);
      mailOptions.attachments = attachments;

      res.info = await transport.sendMail(mailOptions);
      return res;
    } catch (err) {
      res.err = err as Error;
      return res;
    }
  }

  private async compileTemplate(
    mailOptions: Mail.Options & TemplatedMailContent,
    context: unknown
  ): Promise<{ template: string; html: string }> {
    const templateFolder = path.resolve(__dirname, 'assets/mjml');

    const baseTemplate = await fs.readFile(
      path.resolve(templateFolder, 'layout', mailOptions.baseTemplateName + '.mjml'),
      'utf-8'
    );
    const contentTemplate = await fs.readFile(
      path.resolve(templateFolder, 'templates', mailOptions.contentTemplateName + '.mjml'),
      'utf-8'
    );

    const template = baseTemplate.replace('{{{content}}}', contentTemplate);
    const mjmlResult = mjml2html(template, { filePath: path.resolve(templateFolder, 'layout') });

    const hbHtmlTemplate = handlebars.compile(mjmlResult.html);

    const html = hbHtmlTemplate({
      ...(context ?? {}),
      ...(mailOptions.context ?? {}),
    });

    return { template: mjmlResult.html, html: html };
  }

  private async getOrCreateTransport(): Promise<CachedTransporter> {
    const hasConfigChanged = (transporter: CachedTransporter | null, actual: MailerConfig): boolean => {
      const hasChanged =
        transporter != null &&
        (!isEqual(transporter.smtpConfig, actual.smtp) ||
          !isEqual(transporter.defaultOptions, actual.defaultOptions) ||
          !isEqual(transporter.context, actual.context));
      return hasChanged;
    };

    const configChanged = hasConfigChanged(this.cachedTransporter, this.mailerConfig);
    if (configChanged) {
      const maskedConfig = omit(this.mailerConfig, 'password');
      console.warn(`Detected configuration change, rebuilding transporter...`);
      console.warn(maskedConfig);
    }

    if (this.cachedTransporter == null || configChanged) {
      const { smtp: smtpConfig, defaultOptions, context } = this.mailerConfig;
      this.cachedTransporter = {
        ...(await this.mailerTransporterFactory.createTransport(smtpConfig, defaultOptions)),
        context: context,
      };
    }
    return this.cachedTransporter;
  }
}
