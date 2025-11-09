import { CanActivate, ExecutionContext, Injectable, SetMetadata, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { intersection } from 'lodash';
import { RequestWithUserTenant } from '../app/features/auth/request-with-user';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const allowedRoles = this.reflector.get<string[]>('roles', context.getHandler()) ?? [];
    if (allowedRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest<RequestWithUserTenant>();
    const { user } = request;

    if (!user) throw new UnauthorizedException(`User is not logged in`);
    const roles = user.ruoli.map((ruolo) => ruolo.nome);

    const matchingRoles = intersection(roles, allowedRoles);
    return matchingRoles.length > 0;
  }
}
