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
import { StatoTemplateResExcerptDto } from '../../../../../../../api/models';
import { ActiveTenantResolver } from '../../../../../../core/guards/tenant.guard';
import { getInitialTableLazyLoadEvent } from '../../../../../../core/utils/lazy-loading-event.utils';
import { AppBreadcrumbService } from '../../../../../ui/app.breadcrumb.service';
import { StatiTemplateService } from './stati-template.service';

interface State {
  statiTemplateIsLoading: boolean;
  statiTemplateTotalCount: number;
  statiTemplate: StatoTemplateResExcerptDto[];
  currentFilter?: TableLazyLoadEvent;
  editTemplateLoading: boolean;
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
  templateUrl: './stati-template.component.html',
  styleUrls: ['./stati-template.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatiTemplateComponent {
  model$ = this.state.select();

  private table: Table;
  @ViewChild('statiTemplateTable') set setTable(table: Table) {
    if (!table || this.table) return;
    this.table = table;

    this.state.connect(
      'currentFilter',
      table.onLazyLoad.asObservable().pipe(startWith(getInitialTableLazyLoadEvent(table)))
    );
  }

  clonedRoles: { [s: string]: StatoTemplateResExcerptDto } = {};

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
    private readonly statiTemplateService: StatiTemplateService,
    private breadcrumbService: AppBreadcrumbService,
    private readonly tenantResolver: ActiveTenantResolver
  ) {
    this.breadcrumbService.setItems([
      { label: 'Home' },
      { label: 'Admin' },
      { label: 'Statuses management' },
      { label: 'Templates' },
    ]);

    const fetchStatiTemplatesOnFilterChange$ = this.state.$.pipe(
      distinctUntilKeyChanged('currentFilter'),
      map((s) => s.currentFilter),
      filter(isDefined),
      switchMap((filter) =>
        this.statiTemplateService.getStatiTemplate(filter as LazyLoadEvent).pipe(
          map((res) => ({ statiTemplate: res.data, statiTemplateTotalCount: res.totalRecords })),
          startWith({ statiTemplateIsLoading: true }),
          endWith({ statiTemplateIsLoading: false })
        )
      )
    );
    this.state.connect(fetchStatiTemplatesOnFilterChange$);

    this.state.set({
      statiTemplateIsLoading: false,
      statiTemplate: [],
      statiTemplateTotalCount: 0,
      currentFilter: undefined,
      editTemplateLoading: false,
    });
  }

  onRowEditInit(stato: StatoTemplateResExcerptDto) {
    this.clonedRoles[stato.id] = { ...stato };
  }

  onRowEditSave(stato: StatoTemplateResExcerptDto, index: number, descrizione: string) {
    const saveEditStato$ = this.statiTemplateService.editTemplate(stato, this.tenantResolver.resolve()).pipe(
      tap(() => {
        this.clonedRoles[stato.id].descrizione = descrizione;
        const rows = this.state.get('statiTemplate');
        rows.splice(index, 1, this.clonedRoles[stato.id]);
        this.state.set({
          statiTemplate: rows,
        });
        delete this.clonedRoles[stato.id];
      }),
      map(() => ({})),
      startWith({ editTemplateLoading: true }),
      endWith({ editTemplateLoading: false })
    );
    this.state.connect(saveEditStato$);
  }

  onRowEditCancel(stato: StatoTemplateResExcerptDto, index: number) {
    const rows = this.state.get('statiTemplate');
    rows.splice(index, 1, this.clonedRoles[stato.id]);
    this.state.set({
      statiTemplate: rows,
    });
    delete this.clonedRoles[stato.id];
  }
}
