import { Injectable } from '@angular/core';
import dayjs from 'dayjs';
import * as FileSaver from 'file-saver';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { catchError, map, tap, throwError } from 'rxjs';
import * as xlsx from 'xlsx';
import { CreateUserDto, TenantClienteResDto, TenantResDto, UpdateUserDto } from '../../../../../../../api/models';
import {
  ClientiApiClient,
  PrivilegiApiClient,
  TenantsApiClient,
  UsersApiClient,
  UsersStatiAccountsApiClient,
} from '../../../../../../../api/services';
import { convertLazyLoadEvent } from '../../../../../../core/utils/lazy-loading-event.utils';
import { autofitColumns } from '../../../../../../shared/utils/xlsx';

@Injectable({
  providedIn: 'root',
})
export class UsersManagementService {
  todayDate = new Date();

  constructor(
    private readonly messageService: MessageService,
    private readonly usersApiClient: UsersApiClient,
    private readonly tenantsApiClient: TenantsApiClient,
    private readonly privilegiApiClient: PrivilegiApiClient,
    private readonly usersStatiAccountsApiClient: UsersStatiAccountsApiClient,
    private readonly clientiApiClient: ClientiApiClient
  ) {}

  getUsers(event?: LazyLoadEvent) {
    const params = convertLazyLoadEvent(event ?? {})
      .finalize()
      .paramsify();
    return this.usersApiClient.usersControllerFindUsers(params).pipe(
      map((res) => ({
        data: res.data,
        totalRecords: res.meta.totalItems,
      })),
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          summary: `Can't get the list of users`,
          detail: `${err.error?.message ?? err.message}`,
        });
        return throwError(() => err);
      })
    );
  }

  getRoles(event?: LazyLoadEvent) {
    const params = convertLazyLoadEvent(event ?? {})
      .finalize()
      .paramsify();
    return this.privilegiApiClient.ruoliControllerFindRuoli(params).pipe(
      map((res) => ({
        data: res.data,
        totalRecords: res.meta.totalItems,
      })),
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          summary: `Can't get the list of roles`,
          detail: `${err.error?.message ?? err.message}`,
        });
        return throwError(() => err);
      })
    );
  }

  getPermissionLevels(event?: LazyLoadEvent) {
    const params = convertLazyLoadEvent(event ?? {})
      .finalize()
      .paramsify();
    return this.privilegiApiClient.livelliPrivilegioPublicControllerFindLivelliPrivilegio(params).pipe(
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          summary: `Can't get the list of permission levels`,
          detail: `${err.error?.message ?? err.message}`,
        });
        return throwError(() => err);
      })
    );
  }

  getStatuses(event?: LazyLoadEvent) {
    const params = convertLazyLoadEvent(event ?? {})
      .finalize()
      .paramsify();
    return this.usersStatiAccountsApiClient.statiAccountsControllerFindStatiAccounts(params).pipe(
      map((res) => ({
        data: res.data,
        totalRecords: res.meta.totalItems,
      })),
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          summary: `Can't get the list of account statuses`,
          detail: `${err.error?.message ?? err.message}`,
        });
        return throwError(() => err);
      })
    );
  }

  getAgencies() {
    return this.clientiApiClient.clientiControllerFindClienti().pipe(
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          summary: `Can't get the list of agencies`,
          detail: `${err.error?.message ?? err.message}`,
        });
        return throwError(() => err);
      })
    );
  }

  getAgencyClients(tenant: TenantResDto) {
    const params = {
      tenant: tenant.slug,
    };
    return this.tenantsApiClient.tenantsControllerGetClienti(params).pipe(
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          summary: `Can't get the list of agency clients`,
          detail: `${err.error?.message ?? err.message}`,
        });
        return throwError(() => err);
      })
    );
  }

  getUserData(id: number, tenant: TenantResDto) {
    const params = {
      id: id,
      tenant: tenant.slug,
    };
    return this.usersApiClient.usersControllerFindOneUserById(params).pipe(
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          summary: `Can't get the user data`,
          detail: `${err.error?.message ?? err.message}`,
        });
        return throwError(() => err);
      })
    );
  }

  getFeatures(cliente: TenantClienteResDto) {
    const params = {
      tenant: cliente.tenant.slug,
    };
    return this.tenantsApiClient.tenantsFeaturesControllerGetFunzionalita(params).pipe(
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          summary: `Can't get the list of features of the client`,
          detail: `${err.error?.message ?? err.message}`,
        });
        return throwError(() => err);
      })
    );
  }

  getPrivileges(cliente: TenantClienteResDto) {
    const params = {
      tenant: cliente.tenant.slug,
    };
    return this.tenantsApiClient.tenantsPrivilegesControllerGetPrivilegesByRoles(params).pipe(
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          summary: `Can't get the list of roles and privileges of the client`,
          detail: `${err.error?.message ?? err.message}`,
        });
        return throwError(() => err);
      })
    );
  }

  createUser(slug: string, body: CreateUserDto) {
    const params = {
      tenant: slug,
      body: body,
    };
    return this.usersApiClient.usersControllerCreateUser(params).pipe(
      tap(() => {
        this.messageService.add({
          severity: 'success',
          summary: `Creation complete`,
          detail: `User created successfully`,
        });
      }),
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          summary: `Can't create user`,
          detail: `${err.error?.message ?? err.message}`,
        });
        return throwError(() => err);
      })
    );
  }

  editUser(id: number, slug: string, body: UpdateUserDto) {
    const params = {
      id: id,
      tenant: slug,
      body: body,
    };
    return this.usersApiClient.usersControllerUpdateUser(params).pipe(
      tap(() => {
        this.messageService.add({
          severity: 'success',
          summary: `Edit complete`,
          detail: `User edited successfully`,
        });
      }),
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          summary: `Can't edit user`,
          detail: `${err.error?.message ?? err.message}`,
        });
        return throwError(() => err);
      })
    );
  }

  deleteUser(id: number, slug: string) {
    const params = {
      id: id,
      tenant: slug,
    };
    return this.usersApiClient.usersControllerDeleteUser(params).pipe(
      tap(() => {
        this.messageService.add({
          severity: 'success',
          summary: `Deletion complete`,
          detail: `User deleted successfully`,
        });
      }),
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          summary: `Can't delete user`,
          detail: `${err.error?.message ?? err.message}`,
        });
        return throwError(() => err);
      })
    );
  }

  sendVerificationEmail(id: number, slug: string) {
    const params = {
      id: id,
      tenant: slug,
    };
    return this.usersApiClient.usersControllerCreateEmailVerificationChallengeForUser(params).pipe(
      tap(() => {
        this.messageService.add({
          severity: 'success',
          summary: `Email sent`,
          detail: `Verification email sent successfully`,
        });
      }),
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          summary: `Can't send the verification email`,
          detail: `${err.error?.message ?? err.message}`,
        });
        return throwError(() => err);
      })
    );
  }

  async downloadExcel(data) {
    const fileName = 'Users_' + dayjs(this.todayDate).format('DD-MM-YYYY');
    const title = 'Users_' + dayjs(this.todayDate).format('DD-MM-YYYY');
    const headers = [
      'Username',
      'First name',
      'Last name',
      'Agency',
      'Status',
      'Role',
      'Creation date',
      'Expiration date',
    ];

    const options = {
      fieldSeparator: ';',
      quoteStrings: '"',
      decimalseparator: ',',
      showLabels: true,
      showTitle: false,
      title,
      useBom: false,
      noDownload: false,
      headers,
      nullToEmptyString: true,
    };

    const worksheet = xlsx.utils.json_to_sheet(data);
    autofitColumns(worksheet);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, fileName);
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }
}
