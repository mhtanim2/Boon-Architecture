import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteResExcerpt } from '@boon/interfaces/boon-api';
import { RxState } from '@rx-angular/state';
import { RxLet } from '@rx-angular/template/let';
import { chain, first, sortBy } from 'lodash';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { InputSwitchModule } from 'primeng/inputswitch';
import { EMPTY, catchError, endWith, map, of, startWith, switchMap } from 'rxjs';
import { StatoTemplateResExcerptDto, TemplateResExcerptDto } from '../../../../../../../../../api/models';
import { ActiveTenantResolver } from '../../../../../../../../core/guards/tenant.guard';
import { ClientsManagementService } from '../../clients-management.service';

interface State {
  templates: TemplateResExcerptDto[];
  selectedFile: File;
  disableRows: boolean;
}

@Component({
  selector: 'boon-templates-list',
  standalone: true,
  imports: [CommonModule, RxLet, FormsModule, ReactiveFormsModule, ButtonModule, FileUploadModule, InputSwitchModule],
  providers: [RxState],
  templateUrl: './templates-list.component.html',
  styleUrls: ['./templates-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplatesListComponent {
  model$ = this.state.select();

  templatesByFeature$ = this.state.select('templates', (templates) => {
    return chain(templates)
      .groupBy((x) => x.funzionalita.nome)
      .map((group, idFunzionalita) => ({ funzionalita: first(group).funzionalita, templates: sortBy(group, x => x.nome.toLowerCase(), 'asc') }))
      .sortBy(x => x.funzionalita.nome.toLowerCase())
      .value();
  });

  @Input() selectedClient: ClienteResExcerpt;
  @Input() templateStatesList: StatoTemplateResExcerptDto[];

  @Input() set templates(templates: TemplateResExcerptDto[] | null | undefined) {
    this.state.set({
      templates: templates,
      selectedFile: null,
    });
  }

  constructor(
    private readonly state: RxState<State>,
    private clientsManagementService: ClientsManagementService,
    private activeTenantResolver: ActiveTenantResolver,
    private router: Router,
    private readonly route: ActivatedRoute
  ) {
    this.state.set({
      templates: [],
      selectedFile: null,
      disableRows: false,
    });
  }

  onChangeStatusIS(isChecked: boolean, template: TemplateResExcerptDto) {
    const realignStatuses = (mode: boolean) => {
      this.state.set((state) => {
        const index = state.templates.indexOf(template);
        const newStatoTemplate = this.templateStatesList.find((state) => state.flagAbilitato === mode);
        template.stato = newStatoTemplate;
        state.templates.splice(index, 1, template);
        return { templates: state.templates };
      });
    };
    realignStatuses(isChecked);
    const updateTemplateStatus$ = of(EMPTY).pipe(
      switchMap(() => this.clientsManagementService.updateTemplateStateById(this.selectedClient.tenant.slug, template)),
      catchError(() => {
        realignStatuses(!isChecked);
        return of(null);
      }),
      map(() => ({})),
      startWith({ disableRows: true }),
      endWith({ disableRows: false })
    );
    this.state.connect(updateTemplateStatus$);
  }

  goToCreateTemplatePage() {
    this.router.navigate([this.selectedClient.tenant.slug, 'template', 'new'], { relativeTo: this.route });
  }

  goToEditTemplatePage(template: TemplateResExcerptDto) {
    this.router.navigate([this.selectedClient.tenant.slug, 'template', 'id', template.id], { relativeTo: this.route });
  }
}
