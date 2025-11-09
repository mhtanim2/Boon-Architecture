import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

const storageGetObjectPathSchema = z.object({
  wildcard: z.string().min(1),
});

export class StorageGetObjectPathDto extends createZodDto(storageGetObjectPathSchema) {}
