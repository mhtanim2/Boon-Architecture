import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
  applyDecorators,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiParam } from '@nestjs/swagger';
import { TenantsService } from '../tenants/tenants.service';
import { RequestWithUserTenant } from './request-with-user';

export const PARAMS_TENANT_SLUG = 'tenant';

@Injectable()
export class TenantMustBeSpecifiedGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly tenantsService: TenantsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canSkipTenantMustBeSpecifiedGuard =
      this.reflector.get<boolean>('canSkipTenantMustBeSpecifiedGuard', context.getHandler()) ?? false;
    if (canSkipTenantMustBeSpecifiedGuard) return true;

    const request = context.switchToHttp().getRequest<RequestWithUserTenant>();
    const user = request.user;

    const tenantSlug = request.params[PARAMS_TENANT_SLUG];
    const tenant = tenantSlug ? await this.tenantsService.getTenantBySlug(tenantSlug) : null;
    if (!tenant) {
      throw new BadRequestException(`Tenant not found`);
    }
    if (
      user &&
      !user.ruoli.some((ruolo) => ruolo.nome === 'SUPERADMIN') &&
      !user.clienti.some((cliente) => cliente.id === tenant.idCliente)
    ) {
      throw new ForbiddenException(`No permission on tenant`);
    }
    request.tenant = tenant;
    return true;
  }
}

const TenantMustBeSpecifiedToggle = (isActive: boolean) => SetMetadata('canSkipTenantMustBeSpecifiedGuard', !isActive);

export function TenantMustBeSpecified(isActive = true) {
  return applyDecorators(
    ApiParam({
      name: PARAMS_TENANT_SLUG,
      description: 'The slug of the tenant',
      required: false,
    }),
    TenantMustBeSpecifiedToggle(isActive)
  );
}
