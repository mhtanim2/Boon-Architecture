import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUserTenant } from './request-with-user';

export const AuthenticatedUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<RequestWithUserTenant>();

  return request.user;
});
export const ReqTenant = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<RequestWithUserTenant>();

  return request.tenant;
});
