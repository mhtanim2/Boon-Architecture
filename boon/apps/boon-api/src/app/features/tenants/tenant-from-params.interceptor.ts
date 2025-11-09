import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { RequestWithUserTenant } from '../auth/request-with-user';
import { PARAMS_TENANT_SLUG } from '../auth/tenant-must-be-specified.guard';
import { TenantsService } from './tenants.service';

@Injectable()
export class TenantFromParamsInterceptor implements NestInterceptor {
  constructor(private readonly tenantsService: TenantsService) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest<RequestWithUserTenant>();
    const tenantSlug = req.params[PARAMS_TENANT_SLUG];
    if (!req.tenant && tenantSlug) {
      req.tenant = await this.tenantsService.getTenantBySlug(tenantSlug);
    }

    return next.handle();
  }
}
