import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import dayjs from 'dayjs';
import { pick } from 'lodash';
import { ConfirmationService, LazyLoadEvent, MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { catchError, tap, throwError } from 'rxjs';
import {
  CreateUserDto,
  LivelloPrivilegioResDto,
  RuoloResExcerptDto,
  StatoAccountResExcerptDto,
  TenantResDto,
  UpdateUserDto,
  UserResDto,
  UserResExcerptDto,
} from '../../../../../../../api/models';
import { ActiveTenantResolver } from '../../../../../../core/guards/tenant.guard';
import { UtilsService } from '../../../../../../core/services';
import { getInitialTableLazyLoadEvent } from '../../../../../../core/utils/lazy-loading-event.utils';
import { AppBreadcrumbService } from '../../../../../ui/app.breadcrumb.service';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UsersManagementService } from './users-management.service';
import { InputSwitchModule } from 'primeng/inputswitch';
import { SplitButtonModule } from 'primeng/splitbutton';

interface Column {
  field: string;
  header: string;
  exportable: boolean;
  sortField: string;
}

@Component({
  selector: 'boon-users-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MultiSelectModule,
    CalendarModule,
    DropdownModule,
    TableModule,
    InputTextModule,
    CardModule,
    ConfirmDialogModule,
    DialogModule,
    ToastModule,
    TagModule,
    TooltipModule,
    UserFormComponent,
    AvatarModule,
    InputSwitchModule,
    SplitButtonModule
  ],
  providers: [ConfirmationService],
  templateUrl: './users-management.component.html',
  styleUrls: ['./users-management.component.scss'],
})
export class UsersManagementComponent {
  todayDate = new Date();
  pageTitle = 'Users management';
  items: MenuItem[];

  private usersTable: Table;
  @ViewChild('usersTable') set setTable(table: Table) {
    if (!table || this.usersTable) return;
    this.usersTable = table;
  }

  cdIsLoading = false;
  showDialog = false;
  modalTitle = '';
  selectedUser: UserResDto;
  exportCsvName = '';
  totalRecords: number;
  tableIsLoading = false;

  roles: RuoloResExcerptDto[] = [];
  users: UserResExcerptDto[] = [];
  selectedUsers: UserResExcerptDto[] = [];
  statuses: StatoAccountResExcerptDto[] = [];
  permissionLevels: LivelloPrivilegioResDto[] = [];

  agencies: TenantResDto[] = [];
  formIsLoading = false;
  formIsSaving = false;

  cols: Column[] = [
    { field: 'username', header: 'Username', sortField: 'username', exportable: true },
    { field: 'nome', header: 'First name', sortField: 'nome', exportable: true },
    { field: 'cognome', header: 'Last name', sortField: 'cognome', exportable: true },
    { field: 'cliente', header: 'Agency', sortField: 'cliente.id', exportable: true },
    { field: 'ruolo', header: 'Role', sortField: 'ruolo.id', exportable: true },
    { field: 'dataCreazione', header: 'Creation date', sortField: 'dataCreazione', exportable: true },
    { field: 'stato', header: 'Status', sortField: 'stato.id', exportable: true },
    { field: 'azioni', header: '', sortField: 'nome', exportable: false },
  ];

  constructor(
    private utilsService: UtilsService,
    private confirmationService: ConfirmationService,
    private usersManagementService: UsersManagementService,
    private readonly tenantResolver: ActiveTenantResolver,
    private breadcrumbService: AppBreadcrumbService
  ) {
    this.breadcrumbService.setItems([{ label: 'Home' }, { label: 'Admin' }, { label: 'Users management' }]);
    this.getPermissionLevels();
    this.getRoles();
    this.getStatuses();
    this.getAgencies();
    this.exportCsvName = 'Users_' + dayjs().format('DD/MM/YYYY');
    this.items = [
      {
          label: 'CSV',
          icon: 'pi pi-file-excel',
          command: () => {
              this.exportExcel();
          }
      },
  ];
  }

  closeDialog() {
    this.selectedUser = undefined;
    this.modalTitle = '';
  }

  openFormModal(user?) {
    if (user) {
      this.usersManagementService
        .getUserData(user.id, this.tenantResolver.resolve())
        .pipe(
          tap((res) => {
            this.modalTitle = 'Edit user: ' + res.nome + ' ' + res.cognome;
            this.selectedUser = res;
            this.showDialog = true;
          })
        )
        .subscribe();
    } else {
      this.selectedUser = null;
      this.modalTitle = 'Create user';
      this.showDialog = true;
    }
  }

  showDeleteDialog(row, rowIndex): void {
    this.confirmationService.confirm({
      key: 'cd',
      header: 'Delete user',
      message: 'Are you sure you want to delete this user?',
      accept: () => {
        const tenant = row.cliente.tenant;
        this.cdIsLoading = true;
        this.usersManagementService.deleteUser(row.id, tenant.slug).subscribe({
          next: () => {
            this.users.splice(rowIndex, 1);
            this.usersTable.value = this.users;
            this.usersTable.reset();
          },
          complete: () => {
            this.cdIsLoading = false;
          },
        });
      },
    });
  }

  deleteSelectedFiles(users: UserResExcerptDto[]) {
    this.confirmationService.confirm({
      key: 'cd',
      header: users.length === 1 ? 'Delete 1 user' : 'Delete ' + users.length + ' users',
      message:
      users.length === 1
          ? 'Are you sure you want to delete this user?'
          : 'Are you sure you want to delete these ' + users.length + ' users',
      accept: () => {
        const tenant = this.tenantResolver.resolve();
        users.forEach((user) => {
          const tenant = user.cliente.tenant;
          this.cdIsLoading = true;
          this.usersManagementService.deleteUser(user.id, tenant.slug).subscribe({
            next: () => {
              this.users.splice(users.indexOf(user), 1);
              this.usersTable.value = this.users;
              this.usersTable.reset();
            },
            complete: () => {
              this.cdIsLoading = false;
            },
          });
        });
      },
    });
  }

  save(param) {
    this.formIsSaving = true;
    const tenant = param.agenzia;
    const params: CreateUserDto | UpdateUserDto = {
      username: param.username,
      cognome: param.cognome,
      nome: param.nome,
      flagEmailVerificata: param.flagEmailVerificata,
      flagPasswordDaCambiare: param.resetPasswordCheck,
      cliente: param.agenzia.cliente,
      stato: { id: param.stato },
      ruoli: param.ruolo.map((ruoloId) => ({ id: ruoloId })),
      clienti: param.clienti.map((cliente) => ({
        ...pick(cliente, ['id', 'ragioneSociale']),
        privilegi: param.permessiObject
          .find((permessiByCliente) => permessiByCliente.id === cliente.id)
          .privilegi.map((privilegio) =>
            pick(privilegio, ['idFunzionalita', 'funzionalita', 'idLivello', 'flagAbilitata'])
          ),
      })),
    };

    this.selectedUser
      ? this.usersManagementService
          .editUser(this.selectedUser.id, tenant.slug, params)
          .pipe(
            tap((res) => {
              this.showDialog = false;
              this.formIsSaving = false;

              const rowIndex = this.users.findIndex((x) => x.id === res.id);
              this.users[rowIndex] = res;
              this.usersTable.value = this.users;
              this.usersTable.reset();
            }),
            catchError((err) => {
              this.formIsSaving = false;
              return throwError(() => err);
            })
          )
          .subscribe()
      : this.usersManagementService
          .createUser(tenant.slug, params)
          .pipe(
            tap((res) => {
              this.showDialog = false;
              this.formIsSaving = false;

              this.users.push(res);
              this.usersTable.value = this.users;
              this.usersTable.reset();

              setTimeout(() => this.openFormModal(res), 200);
            }),
            catchError((err) => {
              this.formIsSaving = false;
              return throwError(() => err);
            })
          )
          .subscribe();
  }

  onChangeStatus(isChecked: boolean, user: UserResExcerptDto) {
    const realignStatuses = (mode: boolean) => {
        const index = this.users.indexOf(user);
        const newStatoUser = this.statuses.find((state) => state.flagAbilitato === mode);
        user.stato = newStatoUser;
        this.users.splice(index, 1, user);
    };
    realignStatuses(isChecked);

    const params = {
      stato: this.statuses.find((state) => state.flagAbilitato === isChecked),
    }
    this.usersManagementService.editUser(user.id, this.tenantResolver.resolve().slug, params)
    .pipe(
      tap((res) => {
        this.getUsers();
      }),
      catchError((err) => {
        realignStatuses(!isChecked);
        return throwError(() => err);
      })
    )
    .subscribe()
  }

  onTableGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  onLazyLoad(event: LazyLoadEvent) {
    this.getUsers(event);
  }

  getUsers(event?: LazyLoadEvent) {
    this.tableIsLoading = true;
    this.usersManagementService
      .getUsers(event ?? getInitialTableLazyLoadEvent(this.usersTable))
      .pipe(
        tap((res) => {
          this.users = res.data;
          this.totalRecords = res.totalRecords;
          this.tableIsLoading = false;
        })
      )
      .subscribe();
  }

  getRoles() {
    this.usersManagementService
      .getRoles()
      .pipe(
        tap((res) => {
          this.roles = res.data;
        })
      )
      .subscribe();
  }

  getPermissionLevels() {
    this.usersManagementService
      .getPermissionLevels()
      .pipe(
        tap((res) => {
          this.permissionLevels = res.data;
        })
      )
      .subscribe();
  }

  getStatuses() {
    this.usersManagementService
      .getStatuses()
      .pipe(
        tap((res) => {
          this.statuses = res.data;
        })
      )
      .subscribe();
  }

  getAgencies() {
    this.usersManagementService
      .getAgencies()
      .pipe(
        tap((res) => {
          this.agencies = res.data.map((x) => ({ id: x.id, ...x.tenant, cliente: x }));
        })
      )
      .subscribe();
  }

  exportExcel() {
    const data: typeof this.users = this.usersTable.filteredValue ?? this.users;
    const excelData = data.map((x) => ({
      Username: x.username ?? '',
      Name: x.nome ?? '',
      LastName: x.cognome ?? '',
      Status: x.stato.nome ?? '',
      Agency: x.cliente.ragioneSociale ?? '',
      Roles: x.ruoli.map((ruolo) => ruolo.nome).join(', '),
      CreationDate: x.dataCreazione ? dayjs(x.dataCreazione).format('DD-MM-YYYY') : '',
    }));
    this.usersManagementService.downloadExcel(excelData);
  }
}
