import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ActiveTenantResolver } from '@boon/frontend/core/guards/tenant.guard';
import { DEFAULT_TENANT } from '@boon/interfaces/boon-api';
import { Message, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { PasswordModule } from 'primeng/password';
import { catchError, take, tap, throwError } from 'rxjs';
import { AuthService } from '../../core/services';

export interface ResetPasswordForm {
  password: FormControl<string>;
  checkPassword: FormControl<string>;
}

@Component({
  selector: 'boon-reset-password',
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
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup<ResetPasswordForm>;
  isLoading: boolean;
  messages: Message[] = [];
  expired: boolean;
  submitted = false;

  get password() {
    return this.resetPasswordForm.value.password;
  }
  get checkPassword() {
    return this.resetPasswordForm.value.password;
  }

  constructor(
    private activeTenantResolver: ActiveTenantResolver,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService
  ) {
    if (this.activeTenantResolver.resolve().slug !== DEFAULT_TENANT.slug) {
      this.router.navigate([DEFAULT_TENANT.slug, 'reset-password']);
    }

    this.resetPasswordForm = new FormGroup(
      {
        password: new FormControl<string>(
          { value: '', disabled: false },
          { nonNullable: true, validators: [Validators.required] }
        ),
        checkPassword: new FormControl<string>(
          { value: '', disabled: false },
          { nonNullable: true, validators: [Validators.required] }
        ),
      },
      { validators: MustMatch('password', 'checkPassword') }
    );
  }

  submit() {
    this.messages = [];
    this.submitted = true;
    if (this.resetPasswordForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService
      .resetPassword(this.password)
      .pipe(
        take(1),
        tap(() => {
          this.authService.purgeAuth();
          this.isLoading = false;
          this.submitted = false;
          const successMessage = {
            severity: 'success',
            summary: 'Action successful',
            detail: 'You successfully reset your password',
          };
          const params = this.activatedRoute.snapshot.queryParams;
          if (params.redirect) {
            this.messageService.add(successMessage);
            this.router.navigateByUrl(params.redirect);
          } else {
            this.messages = [successMessage];
          }
        }),
        catchError((err) => {
          this.messages = [
            {
              severity: 'error',
              summary: 'Warning',
              detail: 'Unable to reset password this time, please try again later',
            },
          ];
          this.submitted = false;
          this.isLoading = false;
          return throwError(() => err);
        })
      )
      .subscribe();
  }
}

export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: AbstractControl) => {
    const fg = formGroup as FormGroup;
    const control = fg.controls[controlName];
    const matchingControl = fg.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      // return if another validator has already found an error on the matchingControl
      return null;
    }

    // set error on matchingControl if validation fails
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }

    return null;
  };
}
