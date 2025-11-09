import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { isDefined } from '@boon/common/core';
import { RxState } from '@rx-angular/state';
import { RxLet } from '@rx-angular/template/let';
import { LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { EditableRow, Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { distinctUntilKeyChanged, endWith, filter, map, startWith, switchMap, tap } from 'rxjs';
import { StatoAccountResExcerptDto } from '../../../../../../../api/models';
import { ActiveTenantResolver } from '../../../../../../core/guards/tenant.guard';
import { getInitialTableLazyLoadEvent } from '../../../../../../core/utils/lazy-loading-event.utils';
import { AppBreadcrumbService } from '../../../../../ui/app.breadcrumb.service';
import { StatiAccountService } from './stati-account.service';

interface State {
  statiAccountIsLoading: boolean;
  statiAccountTotalCount: number;
  statiAccount: StatoAccountResExcerptDto[];
  currentFilter?: TableLazyLoadEvent;
  editAccountLoading: boolean;
}

@Component({
  selector: 'boon-stati-account',
  templateUrl: './stati-account.component.html',
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
  ],
  providers: [RxState, EditableRow],
  standalone: true,
  styleUrls: ['./stati-account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatiAccountComponent {
  model$ = this.state.select();

  private table: Table;
  @ViewChild('statiAccountTable') set setTable(table: Table) {
    if (!table || this.table) return;
    this.table = table;

    this.state.connect(
      'currentFilter',
      table.onLazyLoad.asObservable().pipe(startWith(getInitialTableLazyLoadEvent(table)))
    );
  }

  clonedRoles: { [s: string]: StatoAccountResExcerptDto } = {};

  cols = [
    {
      header: 'Id',
      field: 'id',
      sortField: 'id',
      hidden: true,
    },
    {
      header: 'Nome',
      field: 'nome',
      sortField: 'nome',
    },
    {
      header: 'Descrizione',
      field: 'descrizione',
      sortField: 'descrizione',
    },
  ];

  constructor(
    private readonly state: RxState<State>,
    private readonly statiAccountService: StatiAccountService,
    private breadcrumbService: AppBreadcrumbService,
    private readonly tenantResolver: ActiveTenantResolver
  ) {
    this.breadcrumbService.setItems([
      { label: 'Home' },
      { label: 'Admin' },
      { label: 'Statuses management' },
      { label: 'Users' },
    ]);

    const fetchStatiAccountsOnFilterChange$ = this.state.$.pipe(
      distinctUntilKeyChanged('currentFilter'),
      map((s) => s.currentFilter),
      filter(isDefined),
      switchMap((filter) =>
        this.statiAccountService.getStatiAccount(filter as LazyLoadEvent).pipe(
          map((res) => ({ statiAccount: res.data, statiAccountTotalCount: res.totalRecords })),
          startWith({ statiAccountIsLoading: true }),
          endWith({ statiAccountIsLoading: false })
        )
      )
    );
    this.state.connect(fetchStatiAccountsOnFilterChange$);

    this.state.set({
      statiAccountIsLoading: false,
      statiAccount: [],
      statiAccountTotalCount: 0,
      currentFilter: undefined,
      editAccountLoading: false,
    });
  }

  onRowEditInit(stato: StatoAccountResExcerptDto) {
    this.clonedRoles[stato.id] = { ...stato };
  }

  onRowEditSave(stato: StatoAccountResExcerptDto, index: number, descrizione: string) {
    const saveEditStato$ = this.statiAccountService.editAccount(stato, this.tenantResolver.resolve()).pipe(
      tap(() => {
        this.clonedRoles[stato.id].descrizione = descrizione;
        const rows = this.state.get('statiAccount');
        rows.splice(index, 1, this.clonedRoles[stato.id]);
        this.state.set({
          statiAccount: rows,
        });
        delete this.clonedRoles[stato.id];
      }),
      map(() => ({})),
      startWith({ editAccountLoading: true }),
      endWith({ editAccountLoading: false })
    );
    this.state.connect(saveEditStato$);
  }

  onRowEditCancel(stato: StatoAccountResExcerptDto, index: number) {
    const rows = this.state.get('statiAccount');
    rows.splice(index, 1, this.clonedRoles[stato.id]);
    this.state.set({
      statiAccount: rows,
    });
    delete this.clonedRoles[stato.id];
  }
}
