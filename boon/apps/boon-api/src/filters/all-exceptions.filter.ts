import { evaluateInput } from '@boon/common/core';
import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { isEmpty } from 'lodash';
import { EntitiesNotFoundByIdsError, EntityNotFoundByIdError } from '../typeorm/find-by-or-fail';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  override catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    switch (true) {
      case exception instanceof EntitiesNotFoundByIdsError:
        this.handleEntitiesNotFoundByIdError(response, exception as EntitiesNotFoundByIdsError);
        break;
      case exception instanceof EntityNotFoundByIdError:
        this.handleEntitiesNotFoundByIdError(response, exception as EntityNotFoundByIdError);
        break;
      case exception instanceof AggregateError:
        this.handleAggregateError(response, exception as AggregateError);
        break;
      case exception instanceof Error && 'name' in exception && 'statusCode' in exception && 'info' in exception:
        this.handleNamedSingleErrorWithCtx(response, exception as Error & { info: object; statusCode: number });
        break;
      case exception instanceof Error && 'name' in exception && 'statusCode' in exception:
        this.handleNamedSingleError(response, exception as Error & { statusCode: number });
        break;
      default:
        super.catch(exception, host);
    }
  }

  handleNamedSingleError(response: Response<any, Record<string, any>>, exception: Error & { statusCode: number }) {
    const status = exception.statusCode;

    response.status(status).json({
      name: exception.name,
      message: exception.message && exception.message !== '' ? exception.message : undefined,
      statusCode: status,
    });
  }

  handleNamedSingleErrorWithCtx(
    response: Response<any, Record<string, any>>,
    exception: Error & { info: object; statusCode: number }
  ) {
    const status = exception.statusCode;

    response.status(status).json({
      name: exception.name,
      message:
        exception.message && exception.message !== '' ? evaluateInput(exception.message, exception.info) : undefined,
      statusCode: status,
      info: exception.info,
    });
  }

  handleAggregateError(response: Response<any, Record<string, any>>, exception: AggregateError) {
    const errors = exception.errors.map((x) => ({
      name: x.name,
      message: x.message !== '' ? evaluateInput(x.message, x.info) : undefined,
      info: !isEmpty(x.info) ? x.info : undefined,
    }));

    const status = HttpStatus.BAD_REQUEST;

    response.status(status).json({
      message: 'Multiple errors occurred.',
      statusCode: status,
      errors: errors,
    });
  }

  handleEntitiesNotFoundByIdError(
    response: Response<any, Record<string, any>>,
    exception: EntityNotFoundByIdError | EntitiesNotFoundByIdsError
  ) {
    const status = HttpStatus.BAD_REQUEST;

    response.status(status).json({
      message: exception.message,
      statusCode: status,
    });
  }
}
