import type Mail = require('nodemailer/lib/mailer');
import { Attachment } from '../constants';

export const attachmentToNodemailer = (attachment: Attachment): Mail.Attachment => {
  return {
    filename: attachment.filename,
    content: attachment.fileblob,
    contentType: attachment.mimetype,
    encoding: 'base64',
  };
};
