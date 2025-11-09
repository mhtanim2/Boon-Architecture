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
import { StatoArticoloResExcerptDto } from '../../../../../../../api/models';
import { ActiveTenantResolver } from '../../../../../../core/guards/tenant.guard';
import { getInitialTableLazyLoadEvent } from '../../../../../../core/utils/lazy-loading-event.utils';
import { AppBreadcrumbService } from '../../../../../ui/app.breadcrumb.service';
import { StatiArticleService } from './stati-articoli.service';

interface State {
  statiArticleIsLoading: boolean;
  statiArticleTotalCount: number;
  statiArticle: StatoArticoloResExcerptDto[];
  currentFilter?: TableLazyLoadEvent;
  editArticleLoading: boolean;
}

@Component({
  selector: 'boon-stati-article',
  templateUrl: './stati-articoli.component.html',
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
  styleUrls: ['./stati-articoli.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatiArticleComponent {
  model$ = this.state.select();

  private table: Table;
  @ViewChild('statiArticleTable') set setTable(table: Table) {
    if (!table || this.table) return;
    this.table = table;

    this.state.connect(
      'currentFilter',
      table.onLazyLoad.asObservable().pipe(startWith(getInitialTableLazyLoadEvent(table)))
    );
  }

  clonedRoles: { [s: string]: StatoArticoloResExcerptDto } = {};

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
    private readonly statiArticleService: StatiArticleService,
    private breadcrumbService: AppBreadcrumbService,
    private readonly tenantResolver: ActiveTenantResolver
  ) {
    this.breadcrumbService.setItems([
      { label: 'Home' },
      { label: 'Admin' },
      { label: 'Statuses management' },
      { label: 'Articles' },
    ]);

    const fetchStatiArticlesOnFilterChange$ = this.state.$.pipe(
      distinctUntilKeyChanged('currentFilter'),
      map((s) => s.currentFilter),
      filter(isDefined),
      switchMap((filter) =>
        this.statiArticleService.getStatiArticoli(filter as LazyLoadEvent).pipe(
          map((res) => ({ statiArticle: res.data, statiArticleTotalCount: res.totalRecords })),
          startWith({ statiArticleIsLoading: true }),
          endWith({ statiArticleIsLoading: false })
        )
      )
    );
    this.state.connect(fetchStatiArticlesOnFilterChange$);

    this.state.set({
      statiArticleIsLoading: false,
      statiArticle: [],
      statiArticleTotalCount: 0,
      currentFilter: undefined,
      editArticleLoading: false,
    });
  }

  onRowEditInit(stato: StatoArticoloResExcerptDto) {
    this.clonedRoles[stato.id] = { ...stato };
  }

  onRowEditSave(stato: StatoArticoloResExcerptDto, index: number, descrizione: string) {
    const saveEditStato$ = this.statiArticleService.editArticolo(stato, this.tenantResolver.resolve()).pipe(
      tap(() => {
        this.clonedRoles[stato.id].descrizione = descrizione;
        const rows = this.state.get('statiArticle');
        rows.splice(index, 1, this.clonedRoles[stato.id]);
        this.state.set({
          statiArticle: rows,
        });
        delete this.clonedRoles[stato.id];
      }),
      map(() => ({})),
      startWith({ editArticleLoading: true }),
      endWith({ editArticleLoading: false })
    );
    this.state.connect(saveEditStato$);
  }

  onRowEditCancel(stato: StatoArticoloResExcerptDto, index: number) {
    const rows = this.state.get('statiArticle');
    rows.splice(index, 1, this.clonedRoles[stato.id]);
    this.state.set({
      statiArticle: rows,
    });
    delete this.clonedRoles[stato.id];
  }
}
