import { ZodDtoStatic } from '@anatine/zod-nestjs';
import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
  SetMetadata,
  StreamableFile,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ZodSchema } from 'zod';
import { validateInterally } from './utils';

const REFLECTOR = 'Reflector';

export const ZodSerializerDtoOptions = 'ZOD_SERIALIZER_DTO_OPTIONS' as const;

export const ZodSerializerDto = (dto: ZodDtoStatic | ZodSchema, isPaginated = false) =>
  SetMetadata(ZodSerializerDtoOptions, { dto, isPaginated });

@Injectable()
export class ZodSerializerInterceptor implements NestInterceptor {
  constructor(@Inject(REFLECTOR) protected readonly reflector: any) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { dto: responseSchema, isPaginated } = this.getContextResponseSchema(context);

    return next.handle().pipe(
      map((res: object | object[]) => {
        if (!responseSchema) return res;
        if (typeof res !== 'object' || res instanceof StreamableFile) return res;

        if (isPaginated) {
          const { data, links, meta } = res as any;
          return {
            data: data.map((item: any) => validateInterally(responseSchema, item).data),
            links,
            meta,
          };
        }

        return Array.isArray(res)
          ? res.map((item) => validateInterally(responseSchema, item).data)
          : validateInterally(responseSchema, res).data;
      })
    );
  }

  protected getContextResponseSchema(context: ExecutionContext): {
    dto: ZodDtoStatic | ZodSchema | undefined;
    isPaginated: boolean;
  } {
    return this.reflector.getAllAndMerge(ZodSerializerDtoOptions, [context.getHandler(), context.getClass()]);
  }
}
