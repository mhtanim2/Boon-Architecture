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
import { StatoRevisioneResExcerptDto } from '../../../../../../../api/models';
import { ActiveTenantResolver } from '../../../../../../core/guards/tenant.guard';
import { getInitialTableLazyLoadEvent } from '../../../../../../core/utils/lazy-loading-event.utils';
import { AppBreadcrumbService } from '../../../../../ui/app.breadcrumb.service';
import { StatiRevisioniService } from './stati-revisioni.service';

interface State {
  statiRevisionIsLoading: boolean;
  statiRevisionsTotalCount: number;
  statiRevisions: StatoRevisioneResExcerptDto[];
  currentFilter?: TableLazyLoadEvent;
  editRevisionLoading: boolean;
}

@Component({
  selector: 'boon-stati-template',
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
  ],
  providers: [RxState, EditableRow],
  templateUrl: './stati-revisioni.component.html',
  styleUrls: ['./stati-revisioni.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatiRevisioniComponent {
  model$ = this.state.select();

  private table: Table;
  @ViewChild('statiRevisionTable') set setTable(table: Table) {
    if (!table || this.table) return;
    this.table = table;

    this.state.connect(
      'currentFilter',
      table.onLazyLoad.asObservable().pipe(startWith(getInitialTableLazyLoadEvent(table)))
    );
  }

  clonedRoles: { [s: string]: StatoRevisioneResExcerptDto } = {};

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
    private readonly statiRevisioniService: StatiRevisioniService,
    private breadcrumbService: AppBreadcrumbService,
    private readonly tenantResolver: ActiveTenantResolver
  ) {
    this.breadcrumbService.setItems([
      { label: 'Home' },
      { label: 'Admin' },
      { label: 'Statuses management' },
      { label: 'Revisions' },
    ]);

    const fetchStatiRevisionsOnFilterChange$ = this.state.$.pipe(
      distinctUntilKeyChanged('currentFilter'),
      map((s) => s.currentFilter),
      filter(isDefined),
      switchMap((filter) =>
        this.statiRevisioniService.getStatiRevisioni(filter as LazyLoadEvent).pipe(
          map((res) => ({ statiRevisions: res.data, statiRevisionsTotalCount: res.totalRecords })),
          startWith({ statiRevisionIsLoading: true }),
          endWith({ statiRevisionIsLoading: false })
        )
      )
    );
    this.state.connect(fetchStatiRevisionsOnFilterChange$);

    this.state.set({
      statiRevisionIsLoading: false,
      statiRevisions: [],
      statiRevisionsTotalCount: 0,
      currentFilter: undefined,
      editRevisionLoading: false,
    });
  }

  onRowEditInit(stato: StatoRevisioneResExcerptDto) {
    this.clonedRoles[stato.id] = { ...stato };
  }

  onRowEditSave(stato: StatoRevisioneResExcerptDto, index: number, descrizione: string) {
    const saveEditStato$ = this.statiRevisioniService.editRevisione(stato, this.tenantResolver.resolve()).pipe(
      tap(() => {
        this.clonedRoles[stato.id].descrizione = descrizione;
        const rows = this.state.get('statiRevisions');
        rows.splice(index, 1, this.clonedRoles[stato.id]);
        this.state.set({
          statiRevisions: rows,
        });
        delete this.clonedRoles[stato.id];
      }),
      map(() => ({})),
      startWith({ editRevisionLoading: true }),
      endWith({ editRevisionLoading: false })
    );
    this.state.connect(saveEditStato$);
  }

  onRowEditCancel(stato: StatoRevisioneResExcerptDto, index: number) {
    const rows = this.state.get('statiRevisions');
    rows.splice(index, 1, this.clonedRoles[stato.id]);
    this.state.set({
      statiRevisions: rows,
    });
    delete this.clonedRoles[stato.id];
  }
}
