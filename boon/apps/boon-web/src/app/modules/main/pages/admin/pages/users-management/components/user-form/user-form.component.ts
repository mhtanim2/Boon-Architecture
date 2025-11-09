import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { chain, first, isEmpty, isNil, negate } from 'lodash';
import { ConfirmationService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { forkJoin, switchMap, tap } from 'rxjs';
import {
  FunzionalitaResDto,
  LivelliPrivilegiResExcerptDto,
  PrivilegiByRuoloResExcerptDto,
  RuoloResExcerptDto,
  TenantClienteResDto,
  TenantResDto,
  UserResDto,
} from '../../../../../../../../../api/models';
import { UtilsService } from '../../../../../../../../core/services';
import { UsersManagementService } from '../../users-management.service';

type Privilege = {
  idFunzionalita: number;
  idLivello: number | null;
  flagAbilitata: boolean;
  funzionalita: string;
};

type CalcPrivilege = Privilege & {
  idLivelloDefault: number | null;
  flagAbilitataDefault: boolean;
};

@Component({
  selector: 'boon-user-form',
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
    CheckboxModule,
    InputSwitchModule,
    TabViewModule,
    TooltipModule,
    DividerModule,
    SkeletonModule,
  ],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent {
  user: UserResDto;
  clients: TenantClienteResDto[] = [];
  permissionObject = [];
  permissionObjectIsDirty = false;
  formIsLoading = true;

  userForm;
  @Input() roles: RuoloResExcerptDto[];
  @Input() permissionLevels: LivelliPrivilegiResExcerptDto[];
  @Input() statuses;

  @Input() formIsSaving: boolean;
  @Input() agencies: TenantResDto[];
  @Input('user') set setUser(user: UserResDto) {
    this.user = user;
    if (user) {

      const selectedAgency = this.agencies.find((agency) => agency.cliente.id === user.cliente.id);
      this.formIsLoading = true;
      this.onChangeAgencyDD(selectedAgency, () => {
        this.userForm.patchValue({
          nome: user.nome,
          cognome: user.cognome,
          stato: user.stato.id,
          ruolo: user.ruoli.map((x) => x.id),
          agenzia: selectedAgency,
          username: user.username,
          clienti: this.clients.filter((x) => user.clienti.map((y) => y.id).includes(x.id)),
          resetPasswordCheck: user.flagPasswordDaCambiare,
          flagEmailVerificata: user.flagEmailVerificata,
        });
        this.onChangeClientsMS(user.clienti);
        this.formIsLoading = false;
      });

      this.userForm.controls.resetPasswordCheck.enable();
      this.userForm.controls.agenzia.disable();
      // setTimeout(() => {

      // }, 2000);
    } else {
      this.clients = [];
      this.userForm.reset();
      this.lastAgency = null;
      this.lastRole = null;
      this.lastClients = null;
      this.permissionObject = [];
      this.permissionObjectIsDirty = false;
      this.formIsLoading = false;

      this.userForm.controls.resetPasswordCheck.disable();
      this.userForm.controls.agenzia.enable();
      this.userForm.patchValue({ resetPasswordCheck: true });
    }
    this.submitted = false;
  }
  isLoading = false;
  submitted = false;
  clientsData: Record<
    string,
    { cliente: TenantClienteResDto; features: FunzionalitaResDto[]; privileges: PrivilegiByRuoloResExcerptDto[] }
  > = {};

  lastAgency;
  lastRole;
  lastClients;

  get isEdit() {
    return this.user && this.user.id != null;
  }

  @Output() submitForm = new EventEmitter();
  @Output() cancelForm = new EventEmitter();

  constructor(
    private utilsService: UtilsService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private usersManagementService: UsersManagementService
  ) {
    this.userForm = new FormGroup({
      nome: new FormControl<string>(
        { value: '', disabled: false },
        { nonNullable: true, validators: [Validators.required] }
      ),
      cognome: new FormControl<string>(
        { value: '', disabled: false },
        { nonNullable: true, validators: [Validators.required] }
      ),
      stato: new FormControl<number>(
        { value: null, disabled: false },
        { nonNullable: true, validators: [Validators.required] }
      ),
      ruolo: new FormControl<number[]>(
        { value: [], disabled: false },
        { nonNullable: true, validators: [Validators.required] }
      ),
      agenzia: new FormControl<number>(
        { value: null, disabled: false },
        { nonNullable: true, validators: [Validators.required] }
      ),
      username: new FormControl<string>(
        { value: '', disabled: false },
        { nonNullable: true, validators: [Validators.required, Validators.email] }
      ),
      clienti: new FormControl<number[]>(
        { value: [], disabled: false },
        { nonNullable: true, validators: [Validators.required] }
      ),
      resetPasswordCheck: new FormControl<boolean>({ value: false, disabled: false }, { nonNullable: true }),
      flagEmailVerificata: new FormControl<boolean>({ value: false, disabled: false }, { nonNullable: true }),
    });
  }

  doSubmitForm() {
    this.submitted = true;
    if (this.userForm.invalid) {
      return;
    }
    const param = this.userForm.getRawValue();
    param.permessiObject = this.permissionObject;
    this.submitForm.emit(param);
  }

  doCancelForm() {
    this.cancelForm.emit();
  }

  onSendVerificationEmailBt(user) {
    this.usersManagementService.sendVerificationEmail(user.id, user.cliente.tenant.slug).pipe().subscribe();
  }

  onShowAgencyDD(event: any) {
    this.lastAgency = this.userForm.value.agenzia;
  }

  onChangeAgencyDD(value: TenantResDto, cb?: () => void) {
    const handle = () => {
      this.userForm.controls.clienti.disable();
      this.usersManagementService
        .getAgencyClients(value)
        .pipe(
          tap((res) => {
            this.clients = res;
          }),
          switchMap((res) => {
            return forkJoin(
              res.flatMap((cliente) => {
                return forkJoin([
                  this.usersManagementService.getFeatures(cliente),
                  this.usersManagementService.getPrivileges(cliente),
                ]).pipe(
                  tap(([features, privileges]) => {
                    this.clientsData[cliente.id] = { cliente, features, privileges };
                    this.userForm.controls.clienti.enable();
                  })
                );
              })
            ).pipe(
              tap(() => {
                if (cb) {
                  cb();
                }
              })
            );
          })
        )
        .subscribe();
    };

    if (!isEmpty(this.lastAgency) && this.permissionObjectIsDirty) {
      this.confirmationService.confirm({
        header: 'Unsaved permission changes',
        icon: 'pi pi-question-circle',
        message:
          'Permissions are to be calculated again. There are unsaved changes in your manual permissions, do you wish to discard them?',
        accept: () => {
          handle();
        },
        reject: () => {
          this.userForm.controls.agenzia.patchValue(this.lastAgency);
        },
      });
    } else {
      handle();
    }
  }

  onShowClientsMS(event: any) {
    this.lastClients = this.userForm.value.clienti;
  }

  onChangeClientsMS(value: TenantClienteResDto[]) {
    const handle = () => {
      const selectedClients = this.clients.filter((client) => value.some((x) => x.id === client.id));
      this.permissionObject = this.createPermissionsObject(this.userForm.value.ruolo, selectedClients);
      this.permissionObjectIsDirty = false;
      if (!this.isEdit) {
        this.onClickResetAllPermissionBt(this.permissionObject);
      }
    };

    if (!isEmpty(this.lastClients) && this.permissionObjectIsDirty) {
      this.confirmationService.confirm({
        header: 'Unsaved permission changes',
        icon: 'pi pi-question-circle',
        message:
          'Permissions are to be calculated again. There are unsaved changes in your manual permissions, do you wish to discard them?',
        accept: () => {
          handle();
        },
        reject: () => {
          this.userForm.controls.clienti.patchValue(this.lastClients);
        },
      });
    } else {
      handle();
    }
  }

  onShowRoleMS(event: any) {
    this.lastRole = this.userForm.value.ruolo;
  }

  onChangeRoleMS(value) {
    const handle = () => {
      const selectedClients = this.clients.filter((client) =>
        this.userForm.value.clienti.some((x) => x.id === client.id)
      );
      this.permissionObject = this.createPermissionsObject(value, selectedClients);
      this.permissionObjectIsDirty = false;
      if (!this.isEdit) {
        this.onClickResetAllPermissionBt(this.permissionObject);
      }
    };

    if (!isEmpty(this.lastRole) && this.permissionObjectIsDirty) {
      this.confirmationService.confirm({
        header: 'Unsaved permission changes',
        icon: 'pi pi-question-circle',
        message:
          'Permissions are to be calculated again. There are unsaved changes in your manual permissions, do you wish to discard them?',
        accept: () => {
          handle();
        },
        reject: () => {
          this.userForm.controls.ruolo.patchValue(this.lastRole);
        },
      });
    } else {
      handle();
    }
  }

  onChangePermissionIS(event) {
    this.permissionObjectIsDirty = true;
  }
  onClickResetPermissionBt(permission: CalcPrivilege) {
    this.resetPermissionToDefault(permission);
    this.permissionObjectIsDirty = true;
  }

  onClickResetClientPermissionBt(clientPermissions: CalcPrivilege[]) {
    clientPermissions.forEach((x) => this.resetPermissionToDefault(x));
  }

  onClickResetAllPermissionBt(object: { privilegi: CalcPrivilege[] }[]) {
    object.forEach((x) => this.onClickResetClientPermissionBt(x.privilegi));
  }

  resetPermissionToDefault(permission: CalcPrivilege) {
    permission.flagAbilitata = permission.flagAbilitataDefault;
    permission.idLivello = permission.idLivelloDefault;
  }

  private createPermissionsObject(selectedRolesIds: number[], selectedClients: TenantClienteResDto[]) {
    return selectedClients
      .map((client) => this.createPermissionsObjectByClient(selectedRolesIds, client))
      .filter(negate(isNil));
  }

  private createPermissionsObjectByClient(selectedRolesIds: number[], client: TenantClienteResDto) {
    const calculateDefaultPrivileges = (...idsRuoli: number[]) => {
      const defaultPrivileges = chain(this.clientsData[client.id].privileges)
        .filter((x) => idsRuoli.includes(x.ruolo.id))
        .flatMap((x) => x.privilegi)
        .orderBy(['idFunzionalita', 'idLivello'], ['asc', 'desc'])
        .uniqBy((x) => x.idFunzionalita)
        .value();
      const missingPrivileges = chain(this.clientsData[client.id].features)
        .differenceWith(defaultPrivileges, (a, b) => a.id === b.idFunzionalita)
        .map((x) => ({
          idFunzionalita: x.id,
          idLivello: null,
          flagAbilitata: false,
          funzionalita: x.descrizione,
        }))
        .value();

      const privileges: Privilege[] = chain([...defaultPrivileges, ...missingPrivileges])
        .orderBy((x) => x.idFunzionalita)
        .value();

      return privileges;
    };

    const calculatePrivileges = (defaultPrivileges: Privilege[], userPrivileges: Privilege[]) => {
      return defaultPrivileges.map((privilege) => {
        const userPrivilege = userPrivileges.find((x) => x.idFunzionalita === privilege.idFunzionalita);

        return {
          idFunzionalita: privilege.idFunzionalita,
          idLivello: (userPrivilege ?? privilege).idLivello ?? first(this.permissionLevels)?.id,
          funzionalita: privilege.funzionalita,
          flagAbilitata: userPrivilege?.flagAbilitata ?? false,
          idLivelloDefault: privilege.idLivello ?? first(this.permissionLevels)?.id,
          flagAbilitataDefault: privilege.flagAbilitata ?? false,
        };
      });
    };

    if (!(selectedRolesIds.length > 0)) return null;

    const defaultPrivileges = calculateDefaultPrivileges(...selectedRolesIds);
    const userPrivileges = (this.user?.clienti?.find((x) => x.id === client.id)?.privilegi ?? []).map((x) => ({
      ...x,
      flagAbilitata: true,
    }));

    const permissionObject = {
      id: client.id,
      nome: client.ragioneSociale,
      privilegi: calculatePrivileges(defaultPrivileges, userPrivileges),
    };
    return permissionObject;
  }
}
