import { createZodDto } from '@anatine/zod-nestjs';
import {
  createFileUploadSchema,
  fileUploadResExcerptSchema,
  fileUploadResSchema,
  updateFileUploadSchema,
} from '@boon/interfaces/boon-api';

export class FileUploadResDto extends createZodDto(fileUploadResSchema) {}
export class FileUploadResExcerptDto extends createZodDto(fileUploadResExcerptSchema) {}

export class CreateFileUploadDto extends createZodDto(createFileUploadSchema) {}
export class UpdateFileUploadDto extends createZodDto(updateFileUploadSchema) {}
