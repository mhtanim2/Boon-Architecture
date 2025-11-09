import { BOON_DATASOURCE } from '@boon/backend/database';
import { BoonLivelliPrivilegiEntity } from '@boon/backend/database/entities/boon.livelli_privilegi.entity';
import { CanActivate, ExecutionContext, Injectable, SetMetadata, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectDataSource } from '@nestjs/typeorm';
import { chain } from 'lodash';
import { DataSource } from 'typeorm';
import { RequestWithUserTenant } from '../app/features/auth/request-with-user';

export type PrivilegeTuple = [feature: string, level: string];

export type RequiredPrivilegeTuple = [feature: string, level?: string];
export type RequiredPrivilege = string | RequiredPrivilegeTuple;

export const Privileges = (...privileges: RequiredPrivilege[]) => SetMetadata('privileges', privileges);

@Injectable()
export class PrivilegesGuard implements CanActivate {
  private privilegeLevelsMap?: { [codice: string]: BoonLivelliPrivilegiEntity };

  constructor(
    private readonly reflector: Reflector,
    @InjectDataSource(BOON_DATASOURCE) private readonly boonDataSource: DataSource
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const allowedPrivileges =
      this.reflector
        .get<RequiredPrivilege[]>('privileges', context.getHandler())
        ?.map<RequiredPrivilege>((privilege) => (typeof privilege === 'string' ? [privilege, undefined] : privilege)) ??
      [];
    if (allowedPrivileges.length === 0) return true;

    const privilegeLevelsMap = this.privilegeLevelsMap ?? (await this.fetchPrivilegeLevelsMap());

    const request = context.switchToHttp().getRequest<RequestWithUserTenant>();
    const { user, tenant } = request;

    if (!user) throw new UnauthorizedException(`User is not logged in`);
    if (!tenant) throw new UnauthorizedException(`Tenant not specified`);
    const privilegesOnTenant = user.clienti
      .find((cliente) => cliente.id === tenant.id)
      ?.privilegi?.map<PrivilegeTuple>((privilegio) => [privilegio.codiceFunzionalita, privilegio.livello]);
    if (!privilegesOnTenant) throw new UnauthorizedException(`No permission on tenant`);

    const matchingPrivileges = privilegesOnTenant.filter(([feature, level]) =>
      allowedPrivileges.some(([requiredFeature, requiredLevel]) => {
        return (
          feature === requiredFeature &&
          privilegeLevelsMap[level].id >= (requiredLevel !== undefined ? privilegeLevelsMap[requiredLevel].id : 0)
        );
      })
    );
    return matchingPrivileges.length > 0;
  }

  private async fetchPrivilegeLevelsMap() {
    const privilegeLevels = await this.boonDataSource.getRepository(BoonLivelliPrivilegiEntity).find();
    this.privilegeLevelsMap = chain(privilegeLevels)
      .keyBy((x) => x.nome)
      .mapValues((x) => x)
      .value();
    return this.privilegeLevelsMap;
  }
}
