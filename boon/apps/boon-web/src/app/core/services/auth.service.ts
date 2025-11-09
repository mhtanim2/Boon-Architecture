import { Injectable } from '@angular/core';
import { BehaviorSubject, lastValueFrom, throwError } from 'rxjs';
import { UtilsService } from './utils.service';

import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { DEFAULT_TENANT } from '@boon/interfaces/boon-api';
import { chain, first, intersection } from 'lodash';
import { catchError, distinctUntilChanged, map, shareReplay, take, tap } from 'rxjs/operators';
import { LivelloPrivilegioResDto, UserResDto } from '../../../api/models';
import { AuthApiClient, PrivilegiApiClient } from '../../../api/services';
import { ActiveTenantResolver } from '../guards/tenant.guard';

export type PrivilegeTuple = [feature: string, level: string];

export type RequiredPrivilegeTuple = [feature: string, level?: string];
export type RequiredPrivilege = string | RequiredPrivilegeTuple;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private privilegeLevelsMap?: { [codice: string]: LivelloPrivilegioResDto };

  private currentUserSubject: BehaviorSubject<UserResDto | null>;

  constructor(
    private activeTenantResolver: ActiveTenantResolver,
    private authApiClient: AuthApiClient,
    private privilegiApiClient: PrivilegiApiClient,
    private router: Router,
    private utilsService: UtilsService
  ) {
    this.currentUserSubject = new BehaviorSubject<UserResDto>(null);
  }

  populate() {
    return this.authApiClient.usersMeControllerGetMe({}).pipe(
      take(1),
      tap((user) => this.setAuth(user)),
      catchError((err: HttpErrorResponse) => {
        return throwError(() => err);
      })
    );
  }

  get currentUser$() {
    return this.currentUserSubject.asObservable().pipe(distinctUntilChanged(), shareReplay(1));
  }
  get isAuthenticated$() {
    return this.currentUser$.pipe(map((user) => !!user));
  }

  get userProfileFullName() {
    const user = this.getCurrentUser();
    const fullName = user ? `${user.nome} ${user.cognome}` : '';
    return fullName;
  }
  get userProfileInitials() {
    const initials = this.userProfileFullName
      .split(' ')
      .map((token) => first(token))
      .slice(0, 3)
      .join('');
    return initials;
  }

  get currentUserTenants() {
    return this.getCurrentUser()?.clienti ?? [];
  }

  setAuth(user: UserResDto) {
    this.currentUserSubject.next(user);
  }

  purgeAuth() {
    this.currentUserSubject.next(null);
    // this.setCurrentTenant(null);
  }

  attemptAuth(username: string, password: string) {
    return this.fetchAccessToken(username, password).pipe(tap(() => this.populate().subscribe()));
  }

  fetchAccessToken(username: string, password: string) {
    const credentials = { username, password };

    const tenant = this.activeTenantResolver.resolve();
    return (
      tenant.id !== DEFAULT_TENANT.id
        ? this.authApiClient.authControllerLogInOnTenant({ body: credentials })
        : this.authApiClient.authControllerLogIn({ body: credentials })
    ).pipe(
      catchError((err: HttpErrorResponse) => {
        return throwError(() => err);
      })
    );
  }

  refreshAccessToken() {
    return this.authApiClient.authControllerRefresh().pipe(
      tap(() => this.populate().subscribe()),
      catchError((err: HttpErrorResponse) => {
        return throwError(() => err);
      })
    );
  }

  logout() {
    return this.authApiClient.authControllerLogOut().pipe(
      tap(() => {
        this.purgeAuth();
        this.router.navigate([this.activeTenantResolver.resolve().slug, 'login']);
      }),
      catchError((err: HttpErrorResponse) => {
        console.error(err);
        this.utilsService.showAlert('error', 'Warning', 'Unable to logout at this time, please try again later');
        return throwError(() => err);
      })
    );
  }

  getCurrentUser(): UserResDto | null {
    return this.currentUserSubject.value;
  }

  async checkRoles(...roles: string[]): Promise<boolean> {
    const user = this.getCurrentUser();
    if (!user) return false;

    const userRoles = user.ruoli.map((role) => role.nome);
    const matchingRoles = intersection(userRoles, roles);
    return matchingRoles.length > 0;
  }

  async checkPrivileges(...privileges: RequiredPrivilege[]): Promise<boolean> {
    const allowedPrivileges =
      privileges.map<RequiredPrivilege>((privilege) =>
        typeof privilege === 'string' ? [privilege, undefined] : privilege
      ) ?? [];
    if (allowedPrivileges.length === 0) return true;

    const user = this.getCurrentUser();
    const tenant = this.activeTenantResolver.resolve();
    if (!user) return false;
    if (!tenant) return false;

    const privilegeLevelsMap = this.privilegeLevelsMap ?? (await this.fetchPrivilegeLevelsMap());

    const privilegesOnTenant = user.clienti
      .find((cliente) => cliente.id === tenant.id)
      ?.privilegi?.map<PrivilegeTuple>((privilegio) => [privilegio.codiceFunzionalita, privilegio.livello]);
    if (!privilegesOnTenant) return false;

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

  recoverPassword(destination: string) {
    const action = 'RESET_PASSWORD';
    return this.authApiClient.authControllerMagicLogIn({ action, body: { destination } }).pipe(
      catchError((err: HttpErrorResponse) => {
        return throwError(() => err);
      })
    );
  }

  resetPassword(password: string) {
    return this.authApiClient.usersMeControllerSetMyPassword({ body: { password } }).pipe(
      catchError((err: HttpErrorResponse) => {
        return throwError(() => err);
      })
    );
  }

  magicLinkTokenCheck(token: string, action?: 'RESET_PASSWORD') {
    return this.authApiClient.authControllerMagicLogInCallback({ token, action }).pipe(
      catchError((err: HttpErrorResponse) => {
        return throwError(() => err);
      })
    );
  }

  private async fetchPrivilegeLevelsMap() {
    const privilegeLevels = (
      await lastValueFrom(this.privilegiApiClient.livelliPrivilegioPublicControllerFindLivelliPrivilegio())
    ).data;
    this.privilegeLevelsMap = chain(privilegeLevels)
      .keyBy((x) => x.nome)
      .mapValues((x) => x)
      .value();
    return this.privilegeLevelsMap;
  }
}
