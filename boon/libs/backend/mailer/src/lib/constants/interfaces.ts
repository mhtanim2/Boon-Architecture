import type { SentMessageInfo, Transporter } from 'nodemailer';
import type { MailOptions } from 'nodemailer/lib/json-transport';
import type { MailerConfig } from './config';

export type SmtpConfig = MailerConfig['smtp'];
export type DefaultOptions = MailerConfig['defaultOptions'];
export type Context = MailerConfig['context'];

export type Attachment = { filename: string; fileblob: string; mimetype: string };

export type TemplatedMailContent = { baseTemplateName: string; contentTemplateName: string; context: unknown };
export type HtmlMailContent = { html: string };
export type MailContent = TemplatedMailContent | HtmlMailContent;

export type SentMailInfo = {
  defaultOptions: DefaultOptions;
  mail: MailOptions;
  compiledTemplate?: string;
  info?: SentMessageInfo;
  err?: Error;
};

export interface CachedTransporter {
  transport: Transporter;
  smtpConfig: SmtpConfig;
  defaultOptions: DefaultOptions;
  context: unknown;
}
