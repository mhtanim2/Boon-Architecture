import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { isDefined } from '@boon/common/core';
import { RxState } from '@rx-angular/state';
import { RxLet } from '@rx-angular/template/let';
import { ConfirmationService, LazyLoadEvent, MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SkeletonModule } from 'primeng/skeleton';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { EMPTY, catchError, distinctUntilKeyChanged, endWith, filter, map, of, startWith, switchMap } from 'rxjs';
import {
  ClienteResDto,
  ClienteResExcerptDto,
  StatoTemplateResExcerptDto,
  TemplateResExcerptDto,
} from '../../../../../../../api/models';
import { getInitialTableLazyLoadEvent } from '../../../../../../core/utils/lazy-loading-event.utils';
import { AppBreadcrumbService } from '../../../../../ui/app.breadcrumb.service';
import { ClientsManagementService } from './clients-management.service';
import { ClientFormComponent, FORM_IS_DONE_COMMAND } from './components/client-form/client-form.component';
import { TemplatesListComponent } from './components/templates-list/templates-list.component';
import { UtilsService } from '../../../../../../core/services';
import { SplitButtonModule } from 'primeng/splitbutton';

interface State {
  clientsIsLoading: boolean;
  clientsTotalCount: number;
  clients: ClienteResExcerptDto[];
  currentFilter?: TableLazyLoadEvent;
  editClientLoading: boolean;
  showDialog: boolean;
  showTemplateDialog: boolean;
  selectedClient: ClienteResDto | undefined | null;
  modalTitle: string;
  templateModalTitle: string;
  templatesList: TemplateResExcerptDto[];
  templateStatesList: StatoTemplateResExcerptDto[];
}

@Component({
  selector: 'boon-clients-management',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    RxLet,
    InputTextModule,
    SkeletonModule,
    ButtonModule,
    TooltipModule,
    FormsModule,
    ReactiveFormsModule,
    MultiSelectModule,
    CalendarModule,
    DropdownModule,
    ConfirmDialogModule,
    DialogModule,
    ToastModule,
    TagModule,
    TooltipModule,
    AvatarModule,
    ClientFormComponent,
    TemplatesListComponent,
    SplitButtonModule
  ],
  providers: [RxState, ConfirmationService],
  templateUrl: './clients-management.component.html',
  styleUrls: ['./clients-management.component.scss'],
})
export class ClientsManagementComponent {
  model$ = this.state.select();

  items: MenuItem[];
  clientsTable: Table;
  @ViewChild('clientsTable') set clientsTableSetter(table: Table) {
    if (!table || this.clientsTable) return;
    this.clientsTable = table;

    this.state.connect(
      'currentFilter',
      table.onLazyLoad.asObservable().pipe(startWith(getInitialTableLazyLoadEvent(table)))
    );
  }

  cols = [
    {
      header: 'Business name',
      field: 'ragioneSociale',
      sortField: 'ragioneSociale',
    },
    {
      header: 'VAT number',
      field: 'partitaIva',
      sortField: 'partitaIva',
    },
    {
      header: 'E-mail',
      field: 'eMail',
      sortField: 'eMail',
    },
    {
      header: 'Phone number',
      field: 'telefono',
      sortField: 'telefono',
    },
    {
      header: 'Web',
      field: 'web',
      sortField: 'web',
    },
    {
      header: 'Slug',
      field: 'tenant.slug',
      sortField: 'tenant.slug',
    },
    {
      header: 'Actions',
      field: 'azioni',
    },
  ];

  constructor(
    private readonly breadcrumbService: AppBreadcrumbService,
    private readonly state: RxState<State>,
    private utilsService: UtilsService,
    private confirmationService: ConfirmationService,
    private clientsManagementService: ClientsManagementService
  ) {
    this.breadcrumbService.setItems([{ label: 'Home' }, { label: 'Admin' }, { label: 'Clients management' }]);
    this.items = [
      {
          label: 'CSV',
          icon: 'pi pi-file-excel',
          command: () => {
              this.exportExcel();
          }
      },
  ];

    const fetchClientsOnFilterChange$ = this.state.$.pipe(
      distinctUntilKeyChanged('currentFilter'),
      map((s) => s.currentFilter),
      filter(isDefined),
      switchMap((filter) => this.getClients(filter as LazyLoadEvent))
    );
    this.state.connect(fetchClientsOnFilterChange$);

    const fetchTemplatesStatusesList$ = of(EMPTY).pipe(
      switchMap(() => this.clientsManagementService.getStatiTemplate()),
      map((res) => ({
        templateStatesList: res.data,
      }))
    );
    this.state.connect(fetchTemplatesStatusesList$);

    this.state.set({
      clientsIsLoading: false,
      clients: [],
      clientsTotalCount: 0,
      currentFilter: undefined,
      editClientLoading: false,
      showDialog: false,
      selectedClient: undefined,
      modalTitle: '',
    });
  }

  getClients(filter: LazyLoadEvent) {
    return this.clientsManagementService.getClients(filter).pipe(
      map((res) => ({ clients: res.data, clientsTotalCount: res.totalRecords })),
      catchError(() => of(null)),
      startWith({ clientsIsLoading: true }),
      endWith({ clientsIsLoading: false })
    );
  }

  onTableGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openFormModal(client?) {
    if (client) {
      const fetchClientById$ = of(EMPTY).pipe(
        switchMap(() => this.clientsManagementService.getClientData(client.id)),
        map((res) => ({
          modalTitle: 'Edit client: ' + res.ragioneSociale,
          showDialog: true,
          selectedClient: res,
        }))
      );
      this.state.connect(fetchClientById$);
    } else {
      this.state.set({
        showDialog: true,
        selectedClient: null,
        modalTitle: 'Create client',
      });
    }
  }

  openTemplatesModal(client) {
    const fetchtemplatesList$ = of(EMPTY).pipe(
      switchMap(() => this.clientsManagementService.getTemplatesListByClientId(client.tenant.slug)),
      map((res) => ({
        selectedClient: client,
        templatesList: res.data,
        showTemplateDialog: true,
        templateModalTitle: 'Templates list for ' + client.ragioneSociale,
      }))
    );
    this.state.connect(fetchtemplatesList$);
  }

  closeDialog() {
    this.state.set({
      showDialog: false,
      selectedClient: undefined,
      modalTitle: '',
    });
  }

  closeTemplateDialog() {
    this.state.set({
      selectedClient: undefined,
      templatesList: [],
      showTemplateDialog: false,
      templateModalTitle: '',
    });
  }

  formIsDone(command: FORM_IS_DONE_COMMAND) {
    this.state.set({
      showDialog: false,
      selectedClient: undefined,
      modalTitle: '',
    });
    if (command === 'close_refetch') {
      const refetchTableValues$ = this.getClients(this.state.get('currentFilter') as LazyLoadEvent);
      this.state.connect(refetchTableValues$);
    }
  }

  exportExcel() {
    const data = this.clientsTable.filteredValue ?? this.state.get('clients');
    const excelData = data.map((x) => ({
      'Business Name': x.ragioneSociale ?? '',
      'Tax Id Number': x.codiceFiscale ?? '',
      'SDI Code': x.codiceSdi ?? '',
      Email: x.eMail ?? '',
      Pec: x.pec ?? '',
      'Phone-Number': x.telefono ?? '',
      Web: x.web ?? '',
      Tenant: x.tenant.slug ?? '',
    }));
    this.clientsManagementService.downloadExcel(excelData);
  }
}
