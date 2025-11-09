import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CodiceFiscaleRegex } from '@boon/common/codice-fiscale';
import { RxState } from '@rx-angular/state';
import { RxLet } from '@rx-angular/template/let';
import { isEmpty } from 'lodash';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { MultiSelectModule } from 'primeng/multiselect';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { EMPTY, catchError, endWith, map, of, startWith, switchMap, tap } from 'rxjs';
import { ClienteResDto } from '../../../../../../../../../api/models';
import { readFileAsDataUrl } from '../../../../../../../../core/utils/file-reader.utils';
import { ClientsManagementService } from './../../clients-management.service';

export type FORM_IS_DONE_COMMAND = 'close' | 'close_refetch';

const clientFormGroupFunc = (client?: ClienteResDto) => ({
  id: new FormControl<number | null>(client?.id ?? null, {}),
  ragioneSociale: new FormControl<string | null>(client?.ragioneSociale ?? null, {
    validators: [Validators.required],
  }),
  partitaIva: new FormControl<string | null>(client?.partitaIva ?? null, {
    validators: [],
  }),
  codiceFiscale: new FormControl<string | null>(client?.codiceFiscale ?? null, {
    validators: [Validators.pattern(CodiceFiscaleRegex)],
  }),
  codiceSdi: new FormControl<string | null>(client?.codiceSdi ?? null, {
    validators: [],
  }),
  pec: new FormControl<string | null>(client?.pec ?? null, {
    validators: [Validators.email],
  }),
  telefono: new FormControl<string | null>(client?.telefono ?? null, {
    validators: [],
  }),
  eMail: new FormControl<string | null>(client?.eMail ?? null, {
    validators: [Validators.email],
  }),
  web: new FormControl<string | null>(client?.web ?? null, {
    validators: [],
  }),
  tenant: new FormControl<string | null>(client?.tenant.slug ?? null, {
    validators: [Validators.required],
  }),
  flagInterno: new FormControl<boolean | null>(client?.flagInterno ?? false, {
    validators: [Validators.required],
  }),
  logo: new FormControl<string | null>(client?.tenant.logo ?? null, {
    validators: [],
  }),
});
export type ClientFormValue = FormGroup<ReturnType<typeof clientFormGroupFunc>>['value'];

interface State {
  isLoading: boolean;
  isSaving: boolean;
  submitted: boolean;

  clientId: number | null;
  client: ClienteResDto | null | undefined;
}

@Component({
  selector: 'boon-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss'],
  standalone: true,
  providers: [RxState],
  imports: [
    CommonModule,
    RxLet,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    ChipModule,
    DropdownModule,
    MultiSelectModule,
    InputTextModule,
    InputMaskModule,
    TriStateCheckboxModule,
    DividerModule,
    MessagesModule,
    SkeletonModule,
    CalendarModule,
    TooltipModule,
    FileUploadModule,
    InputSwitchModule,
  ],
})
export class ClientFormComponent {
  model$ = this.state.select();
  submitted = false;
  clientForm: FormGroup<ReturnType<typeof clientFormGroupFunc>>;

  @ViewChild('fileUpload') fileUpload: FileUpload;

  @Input() set client(client: ClienteResDto | null | undefined) {
    if (client === undefined) {
      this.state.set({
        submitted: false,
        isLoading: false,
      });
      return;
    }

    this.clientForm.reset();
    this.clientForm.patchValue(new FormGroup(clientFormGroupFunc(client ?? undefined)).value);
    this.state.set({
      client: client,
      submitted: false,
      isLoading: false,
    });
  }

  @Output() formIsDone = new EventEmitter<FORM_IS_DONE_COMMAND>();

  constructor(private readonly state: RxState<State>, private clientsManagementService: ClientsManagementService) {
    this.state.set({
      isLoading: true,
    });
    this.clientForm = new FormGroup(clientFormGroupFunc());
  }

  async selectFile(files: Array<File>) {
    const reader = new FileReader();
    if (files && files.length) {
      const [file] = files;
      const dataUrl = await readFileAsDataUrl(file);
      this.clientForm.patchValue({ logo: dataUrl });
    }
  }

  onFileRemove() {
    this.clientForm.patchValue({ logo: null });
  }

  revertChanges() {
    this.clientForm.patchValue(new FormGroup(clientFormGroupFunc(this.state.get('client') ?? undefined)).value);
  }

  closeDialog() {
    this.formIsDone.emit('close');
  }

  saveChanges() {
    this.state.set({
      submitted: true,
    });
    const formRawValue = this.clientForm.getRawValue();
    if (!this.clientForm.valid) return;

    const params = {
      ragioneSociale: formRawValue.ragioneSociale,
      partitaIva: !isEmpty(formRawValue.partitaIva) ? formRawValue.partitaIva : null,
      codiceFiscale: !isEmpty(formRawValue.codiceFiscale) ? formRawValue.codiceFiscale : null,
      codiceSdi: !isEmpty(formRawValue.codiceSdi) ? formRawValue.codiceSdi : null,
      pec: !isEmpty(formRawValue.pec) ? formRawValue.pec : null,
      indirizzo: null,
      cap: null,
      telefono: !isEmpty(formRawValue.telefono) ? formRawValue.telefono : null,
      eMail: !isEmpty(formRawValue.eMail) ? formRawValue.eMail : null,
      web: !isEmpty(formRawValue.web) ? formRawValue.web : null,
      flagInterno: formRawValue.flagInterno,
      tenant: {
        slug: formRawValue.tenant,
        logo: !isEmpty(formRawValue.logo) ? formRawValue.logo : null,
      },
    };

    const saveClient$ = of(EMPTY).pipe(
      switchMap(() => {
        return formRawValue.id
          ? this.clientsManagementService.updateClient(formRawValue.id, params)
          : this.clientsManagementService.createClient(params);
      }),
      catchError(() => of(null)),
      tap(() => {
        this.fileUpload.clear();
        this.formIsDone.emit('close_refetch');
      }),
      map(() => ({})),
      startWith({ isSaving: true }),
      endWith({ isSaving: false })
    );
    this.state.connect(saveClient$);
  }
}
