import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi as s } from '@anatine/zod-openapi';
import { createFileUploadSchema } from '@boon/interfaces/boon-api';
import { z } from 'zod';

const articoliBulkImportSchema = createFileUploadSchema.extend({
  data: s(
    z
      .string()
      .transform((plainArray) => JSON.parse(plainArray))
      .pipe(z.array(z.record(z.any()))),
    { type: 'string', format: 'json' }
  ),
});
export type ArticoliBulkImport = z.infer<typeof articoliBulkImportSchema>;
export class BulkImportArticoliDto extends createZodDto(articoliBulkImportSchema) {}
