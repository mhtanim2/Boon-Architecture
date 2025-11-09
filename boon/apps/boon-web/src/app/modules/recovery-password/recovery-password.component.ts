import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Message } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { PasswordModule } from 'primeng/password';
import { catchError, take, tap, throwError } from 'rxjs';
import { AuthService } from '../../core/services';

export interface RecoveryPasswordForm {
  username: FormControl<string>;
}

@Component({
  selector: 'boon-recovery-password',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    PasswordModule,
    MessagesModule,
  ],
  templateUrl: './recovery-password.component.html',
  styleUrls: ['./recovery-password.component.scss'],
})
export class RecoveryPasswordComponent {
  recoveryPasswordForm: FormGroup<RecoveryPasswordForm>;
  isLoading: boolean;
  messages: Message[] = [];
  expired: boolean;
  submitted = false;

  get username() {
    return this.recoveryPasswordForm.value.username;
  }

  constructor(private authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.recoveryPasswordForm = new FormGroup({
      username: new FormControl<string>(
        { value: '', disabled: false },
        { nonNullable: true, validators: [Validators.required, Validators.email] }
      ),
    });
  }

  submit() {
    this.submitted = true;
    this.messages = [];
    if (this.recoveryPasswordForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService
      .recoverPassword(this.username)
      .pipe(
        take(1),
        tap((res) => {
          this.isLoading = false;
          this.submitted = false;
          this.messages = [
            {
              severity: 'success',
              summary: 'Success',
              detail: `A mail will be sent to the address you inserted, with verification code ${res.code}`,
            },
          ];
        }),
        catchError((err) => {
          this.messages = [
            { severity: 'error', summary: 'Warning', detail: 'Unable to recover password, please try again later' },
          ];
          this.isLoading = false;
          this.submitted = false;
          return throwError(() => err);
        })
      )
      .subscribe();
  }
}
