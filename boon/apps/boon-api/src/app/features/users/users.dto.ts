import { createZodDto } from '@anatine/zod-nestjs';
import { createUserSchema, updateUserSchema, userResExcerptSchema, userResSchema } from '@boon/interfaces/boon-api';

export class UserResDto extends createZodDto(userResSchema) {}
export class UserResExcerptDto extends createZodDto(userResExcerptSchema) {}

export class CreateUserDto extends createZodDto(createUserSchema) {}
export class UpdateUserDto extends createZodDto(updateUserSchema) {}
