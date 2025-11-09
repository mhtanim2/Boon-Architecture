import { createZodDto } from '@anatine/zod-nestjs';
import {
  loginWithCredentialsBodySchema,
  loginWithMagicLinkBodySchema,
  loginWithMagicLinkCallbackQuerySchema,
  loginWithMagicLinkQuerySchema,
  loginWithMagicLinkResBodySchema,
} from '@boon/interfaces/boon-api';

export class LoginWithCredentialsBodyDto extends createZodDto(loginWithCredentialsBodySchema) {}

export class LoginWithMagicLinkQueryDto extends createZodDto(loginWithMagicLinkQuerySchema) {}
export class LoginWithMagicLinkBodyDto extends createZodDto(loginWithMagicLinkBodySchema) {}
export class LoginWithMagicLinkResBodyDto extends createZodDto(loginWithMagicLinkResBodySchema) {}

export class LoginWithMagicLinkCallbackQueryDto extends createZodDto(loginWithMagicLinkCallbackQuerySchema) {}
