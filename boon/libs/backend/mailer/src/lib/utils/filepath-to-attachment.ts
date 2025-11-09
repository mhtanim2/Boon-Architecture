import { promises as fs } from 'fs';
import * as mime from 'mime-types';
import * as path from 'path';
import { Attachment } from '../constants';

export const filepathToAttachment = async (filepath: string): Promise<Attachment> => {
  const filename = path.basename(filepath);

  const mimetype = mime.contentType(path.extname(filepath));
  if (!mimetype) throw new Error(`Cannot determine mimeType for file ${filename}`);

  const fileblob = await fs.readFile(filepath, 'base64');

  return {
    filename: filename,
    fileblob: fileblob,
    mimetype: mimetype,
  };
};
