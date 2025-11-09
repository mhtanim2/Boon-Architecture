import { extendApi as s } from '@anatine/zod-openapi';
import { boonFileUploadSchema, boonTemplateClientiSchema } from '@boon/interfaces/database';
import { isEmpty } from 'lodash';
import { z } from 'zod';
import { templateSchema } from '../template';
import { userSchema } from '../users';

export const fileUploadSchema = boonFileUploadSchema;
export type FileUpload = z.infer<typeof fileUploadSchema>;

export const fileUploadResSchema = fileUploadSchema
  .omit({
    idTemplate: true,
    idUploader: true,
  })
  .extend({
    template: z.object({
      id: templateSchema.shape.id,
      nome: templateSchema.shape.nome,
    }),
    uploader: z.object({
      id: userSchema.shape.id,
      username: userSchema.shape.username,
      nome: userSchema.shape.nome,
      cognome: userSchema.shape.cognome,
    }),
  });
export type FileUploadRes = z.infer<typeof fileUploadResSchema>;

export const fileUploadResExcerptSchema = fileUploadResSchema;
export type FileUploadResdExcerpt = z.infer<typeof fileUploadResExcerptSchema>;

export const createFileUploadSchema = s(
  boonFileUploadSchema
    .omit({
      id: true,
      idTemplate: true,
      idUploader: true,
      nomeFile: true,
      url: true,
      dimensione: true,
      dataOra: true,
      ultimaModifica: true,
    })
    .extend({
      template: s(
        z
          .string()
          .transform((plainObj) => (!isEmpty(plainObj) ? JSON.parse(plainObj) : undefined))
          .pipe(
            z.object({
              id: boonTemplateClientiSchema.shape.id,
              nome: boonTemplateClientiSchema.shape.nome.optional(),
            })
          ),
        { type: 'string', format: 'json' }
      ),
      file: s(z.any(), { type: 'string', format: 'binary' }),
    }),
  { required: ['file'] }
);
export type CreateFileUpload = z.infer<typeof createFileUploadSchema>;

export const updateFileUploadSchema = createFileUploadSchema
  .omit({
    template: true,
  })
  .partial();
export type UpdateFileUpload = z.infer<typeof updateFileUploadSchema>;
