import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RxState } from '@rx-angular/state';
import { RxLet } from '@rx-angular/template/let';
import { last, pullAt, some, sortBy } from 'lodash';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { OrderListModule } from 'primeng/orderlist';
import { SkeletonModule } from 'primeng/skeleton';
import { EMPTY, catchError, distinctUntilKeyChanged, endWith, filter, forkJoin, map, of, startWith, switchMap, take, tap } from 'rxjs';
import { FunzionalitaResDto, StatoTemplateResExcerptDto, TenantResDto } from '../../../../../../../api/models';
import { TenantsApiClient } from '../../../../../../../api/services';
import { AppBreadcrumbService } from '../../../../../ui/app.breadcrumb.service';
import { ClientsTemplateService, TemplateRes } from './clients-template.service';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TooltipModule } from 'primeng/tooltip';
import { selectSlice, isDefined, stateful } from '@rx-angular/state/selections';

const tipoDatiList = ['text', 'number', 'date'];

export const templateFormGroupFunc = (template: TemplateRes | undefined) => {
  return {
    id: new FormControl<number | null>(template?.id ?? null),
    nome: new FormControl<string | null>(template?.nome ?? null, {
      validators: [Validators.required],
    }),
    idFunzionalita: new FormControl<number | null>(template?.funzionalita?.id ?? null, {
      validators: [Validators.required],
    }),
    stato: new FormControl<StatoTemplateResExcerptDto | null>(template?.stato ?? null, {
      validators: [Validators.required],
    }),
    composizione: new FormArray(
      template?.composizione.map(
        (colonna: any) => new FormGroup(colonnaFormGroupFunc(colonna)) //TODO
      ) ?? []
    ),
  };
};

export const colonnaFormGroupFunc = (colonna: any | undefined) => {
  return {
    id: new FormControl<number | null>(colonna?.id ?? null),
    flagRichiesto: new FormControl<boolean>(colonna?.flagRichiesto ?? false, {
      validators: [Validators.required],
    }),
    nomeColonna: new FormControl<string | null>(colonna?.nomeColonna ?? null, { validators: [Validators.required] }),
    lunghezzaMassima: new FormControl<number | null>(colonna?.lunghezzaMassima ?? null),
    tipoDati: new FormControl<string>(colonna?.tipoDati ?? tipoDatiList[0], { validators: [Validators.required] }),
    regola: new FormControl<string | null>(colonna?.regola ?? null),
    dataMatch: new FormControl<string | null>(colonna?.dataMatch ?? null),
  };
};

interface State {
  isLoading: boolean;
  isSaving: boolean;

  clientSlug: string;
  clientInfo: TenantResDto;

  funzionalitaClient: FunzionalitaResDto[] | null;
  funzionalitaClientIsLoading: boolean;

  templateId: number | null;
  template: TemplateRes | null;
  templateIsLoading: boolean;

  statiTemplate: StatoTemplateResExcerptDto[];
  statiTemplateIsLoading: boolean;

  orderOfColumns: number[];
  tipoDatiList: Array<any & { nome: string }>; //TODO
}

@Component({
  selector: 'boon-clients-template',
  standalone: true,
  providers: [RxState, ConfirmationService],
  imports: [
    CommonModule,
    RxLet,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    OrderListModule,
    InputTextModule,
    CheckboxModule,
    DropdownModule,
    InputNumberModule,
    InputSwitchModule,
    TooltipModule,
    SkeletonModule,
  ],
  templateUrl: './clients-template.component.html',
  styleUrls: ['./clients-template.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsTemplatesComponent {
  model$ = this.state.select();

  templateForm: FormGroup<ReturnType<typeof templateFormGroupFunc>>;

  constructor(
    private readonly router: Router,
    private readonly breadcrumbService: AppBreadcrumbService,
    private readonly state: RxState<State>,
    private readonly route: ActivatedRoute,
    private readonly tenantsApiClient: TenantsApiClient,
    private clientsTemplateService: ClientsTemplateService
  ) {
    this.templateForm = new FormGroup(templateFormGroupFunc(undefined));
    this.breadcrumbService.setItems([{ label: 'Home' }, { label: 'Admin' }, { label: 'Clients templates' }]);
    this.state.set({
      templateId: null,
      template: null,
      templateIsLoading: false,
      orderOfColumns: [],
      tipoDatiList: tipoDatiList,
    });

    const isLoading$ = this.state.select(['templateIsLoading', 'funzionalitaClientIsLoading'], (s) => some(s));
    this.state.connect('isLoading', isLoading$);

    const params$ = this.route.paramMap.pipe(
      map((params) => {
        const clientSlug = params.get('clientSlug');
        const rawTemplateId = params.get('id');
        const templateId = rawTemplateId ? Number(rawTemplateId) : null;
        return { clientSlug, templateId };
      })
    );
    this.state.connect(params$);

    const fetchTemplateById$ = params$.pipe(
      take(1),
      switchMap(({ clientSlug, templateId }) => {
        const templateObs =
          templateId != null ? this.clientsTemplateService.getTemplateById(clientSlug, templateId) : of(null);
        const clientInfoObs = this.tenantsApiClient.tenantsControllerGetTenantInfo({ tenant: clientSlug });
        return forkJoin([templateObs, clientInfoObs]);
      }),
      tap(([template, clientInfo]) => {
        if (!clientInfo) return;

        this.templateForm.patchValue(new FormGroup(templateFormGroupFunc(template)).value);
        this.templateForm.controls.composizione.clear();
        this.state.set((s) => ({ orderOfColumns: [] }));
        sortBy(template?.composizione ?? [null], (x) => x?.posizione).forEach((colonna, index) => {
          this.templateForm.controls.composizione.push(new FormGroup(colonnaFormGroupFunc(colonna)));
          this.state.set((s) => ({ orderOfColumns: [...s.orderOfColumns, index] }));
        });
        if (template) {
          this.state.set({
            clientInfo: clientInfo,
            template: template,
          });
        } else {
          this.state.set({
            clientInfo: clientInfo,
            template: null,
          });
        }
      }),
      map(() => ({})),
      startWith({ templateIsLoading: true }),
      endWith({ templateIsLoading: false })
    );

    const fetchFunzionalitaByClient$ = params$.pipe(
      take(1),
      switchMap(({ clientSlug }) => this.clientsTemplateService.getFunzionalitaForClient(clientSlug)),
      map((funzionalitaClient) => ({ funzionalitaClient })),
      startWith({ funzionalitaClientIsLoading: true }),
      endWith({ funzionalitaClientIsLoading: false })
    );

    const fetchStatiTemplate$ = of(EMPTY).pipe(
      switchMap(() => this.clientsTemplateService.getStatiTemplate()),
      map((res) => ({
        statiTemplate: res.data,
      })),
      startWith({ statiTemplateIsLoading: true }),
      endWith({ statiTemplateIsLoading: false })
    );

    const alignSelectedStatoTemplate$ = this.state.$.pipe(
      stateful(map((s) => s.statiTemplate)),
      tap(() => {
        this.changeState(true, this.templateForm);
      }),
      map(() => ({}))
    )
    this.state.connect(alignSelectedStatoTemplate$);

    const redirectToPageOnTemplateIdChange$ = this.state.$.pipe(
      selectSlice(['templateId', 'template']),
      distinctUntilKeyChanged('template'),
      filter(({ templateId, template }) => {
        return template != null && templateId !== template?.id;
      }),
      map(({ template }) => template?.id),
      filter(isDefined),
      tap((id) => {
        this.router.navigate(['../id/', id], { relativeTo: this.route });
      }),
      map(() => ({}))
    );
    this.state.connect(redirectToPageOnTemplateIdChange$);

    this.state.connect(fetchStatiTemplate$);
    this.state.connect(fetchFunzionalitaByClient$);
    this.state.connect(fetchTemplateById$);
  }

  revertChanges() {
    const template = this.state.get('template');
    this.templateForm.patchValue(new FormGroup(templateFormGroupFunc(template)).value);
    this.templateForm.controls.composizione.clear();
    this.state.set((s) => ({ orderOfColumns: [] }));
    sortBy(template?.composizione ?? [null], (x) => x?.posizione).forEach((colonna, index) => {
      this.templateForm.controls.composizione.push(new FormGroup(colonnaFormGroupFunc(colonna)));
      this.state.set((s) => ({ orderOfColumns: [...s.orderOfColumns, index] }));
    });
  }

  addColonna() {
    const newColonnaForm = new FormGroup(colonnaFormGroupFunc(undefined));
    this.templateForm.controls.composizione?.push(newColonnaForm);
    this.state.set((s) => {
      const index = (last(s.orderOfColumns) ?? -1) + 1;
      return { orderOfColumns: [...s.orderOfColumns, index] };
    });
  }

  deleteColonna(index: number) {
    this.state.set((s) => {
      const value = s.orderOfColumns[index];
      pullAt(s.orderOfColumns, index);
      return { orderOfColumns: s.orderOfColumns.map((order) => (order > value ? order - 1 : order)) };
    });
    this.templateForm.controls.composizione.removeAt(index);
  }

  submit() {
    if (!this.templateForm.valid) {
      console.log(this.templateForm.getRawValue());
      console.log(this.templateForm);
      return;
    }

    const values = this.templateForm.getRawValue();
    const columnsOrdinate = this.state.get('orderOfColumns').map((order) => (values.composizione ?? [])[order]);

    const params = {
      nome: values.nome!,
      funzionalita: {
        id: values.idFunzionalita!,
      },
      stato: {
        id: values.stato.id!,
      },
      composizione: columnsOrdinate.map((regola, index) => ({
        nomeColonna: regola.nomeColonna,
        tipoDati: regola.tipoDati,
        lunghezzaMassima: regola.lunghezzaMassima,
        flagRichiesto: regola.flagRichiesto,
        regola: regola.regola,
        posizione: index,
        dataMatch: regola.dataMatch,
      })),
    };

    const clientSlug = this.state.get('clientSlug');
    const saveTemplate$ = of(null).pipe(
      switchMap(() => {
        return values.id !== null
          ? this.clientsTemplateService.updateTemplate(clientSlug, values.id, params)
          : this.clientsTemplateService.createTemplate(clientSlug, params);
      }),
      catchError((err) => of(null)),
      tap((template) => {
        if (!template) return;

        this.templateForm.patchValue(new FormGroup(templateFormGroupFunc(template)).value);
        this.templateForm.controls.composizione.clear();
        this.state.set((s) => ({ orderOfColumns: [] }));
        sortBy(template?.composizione ?? [null], (x) => x?.posizione).forEach((colonna, index) => {
          this.templateForm.controls.composizione.push(new FormGroup(colonnaFormGroupFunc(colonna)));
          this.state.set((s) => ({ orderOfColumns: [...s.orderOfColumns, index] }));
        });
      }),
      map((template) => ({ template })),
      startWith({ isSaving: true }),
      endWith({ isSaving: false })
    );
    this.state.connect(saveTemplate$);
  }

  changeState(isChecked: boolean, templateForm: FormGroup<ReturnType<typeof templateFormGroupFunc>>) {
    const templateState = this.state.get('statiTemplate').find(stato => stato.flagAbilitato === isChecked);
    templateForm.controls.stato.patchValue(templateState);
  }
}
