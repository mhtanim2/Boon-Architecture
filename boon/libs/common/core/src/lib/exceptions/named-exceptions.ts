import { AnyZodObject, z } from 'zod';

export function NamedSingleError(def: { code: string; message?: string; statusCode?: number }) {
  return class NamedSingleError extends Error {
    override cause?: Error;
    statusCode?: number;

    constructor(options?: { err?: Error; message?: string | undefined }) {
      super(options?.message ?? def.message ?? '');
      this.cause = options?.err;
      this.name = def.code;
      this.statusCode = def.statusCode;
    }
  };
}

export function NamedSingleErrorWithCtx<T extends AnyZodObject>(def: {
  code: string;
  message?: string;
  ctx: T;
  statusCode?: number;
}) {
  return class NamedSingleErrorWithCtx extends Error {
    override cause?: Error;
    statusCode?: number;
    info: object;

    constructor(options: { err?: Error; message?: string | undefined; ctx: z.infer<typeof def.ctx> }) {
      super(options?.message ?? def.message ?? '');
      this.cause = options.err;
      this.name = def.code;
      this.statusCode = def.statusCode;
      this.info = options.ctx;
    }
  };
}
