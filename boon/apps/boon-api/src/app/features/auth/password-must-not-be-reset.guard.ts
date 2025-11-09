import { CanActivate, ExecutionContext, ForbiddenException, HttpStatus, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UrlGeneratorService } from 'nestjs-url-generator';
import { RequestWithUserTenant } from './request-with-user';
// import { UsersMeController } from './users-me.controller';

export const PasswordMustNotBeReset = (isActive: boolean) =>
  SetMetadata('canSkipPasswordMustNotBeResetCheck', !isActive);
@Injectable()
export class PasswordMustNotBeResetGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly urlGeneratorService: UrlGeneratorService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canSkipPasswordMustNotBeResetCheck =
      this.reflector.get<boolean>('canSkipPasswordMustNotBeResetCheck', context.getHandler()) ?? false;
    if (canSkipPasswordMustNotBeResetCheck) return true;

    const request = context.switchToHttp().getRequest<RequestWithUserTenant>();
    const canActivate = !request.user || !request.user.flagPasswordDaCambiare;
    if (!canActivate) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: 'Password expired or reset. Must be changed.',
        // _links: {
        //   set_password: this.urlGeneratorService.generateUrlFromController({
        //     controller: UsersMeController,
        //     controllerMethod: UsersMeController.prototype.setMyPassword,
        //   }),
        // },
      });
    }
    return true;
  }
}
