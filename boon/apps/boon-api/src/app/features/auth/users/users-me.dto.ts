import { createZodDto } from '@anatine/zod-nestjs';
import { setMyPasswordSchema, userResExcerptSchema, userResSchema } from '@boon/interfaces/boon-api';

export class UserMeResDto extends createZodDto(userResSchema) {}
export class UserMeResExcerptDto extends createZodDto(userResExcerptSchema) {}

export class SetMyPasswordDto extends createZodDto(setMyPasswordSchema) {}
