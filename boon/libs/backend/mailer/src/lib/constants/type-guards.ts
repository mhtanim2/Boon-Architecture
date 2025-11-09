import type { HtmlMailContent, TemplatedMailContent } from './interfaces';

export const isTemplatedEmail = (
  mailOptions: TemplatedMailContent | HtmlMailContent
): mailOptions is TemplatedMailContent => {
  const opts = mailOptions as TemplatedMailContent;
  return opts.contentTemplateName !== undefined && opts.context !== undefined;
};
