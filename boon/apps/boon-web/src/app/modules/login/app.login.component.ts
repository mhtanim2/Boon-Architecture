import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ActiveTenantResolver } from '@boon/frontend/core/guards/tenant.guard';
import { isNil, negate } from 'lodash';
import { Message } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { PasswordModule } from 'primeng/password';
import { catchError, take, tap, throwError } from 'rxjs';
import { AuthService } from '../../core/services';

export interface LoginForm {
  username: FormControl<string>;
  password: FormControl<string>;
}

export class AuthLoginError {
  readonly code: string;
  readonly message: string;
  readonly severity: 'warn' | 'danger' = 'danger';
  readonly title?: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './app.login.component.html',
  standalone: true,
  styleUrls: ['./app.login.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    PasswordModule,
    MessagesModule,
    MessageModule,
  ],
})
export class AppLoginComponent implements OnInit {
  loginForm: FormGroup<LoginForm>;
  isLoading: boolean;
  messages: Message[] = [];
  expired: boolean;
  submitted = false;
  errorCode: string;

  get username() {
    return this.loginForm.value.username;
  }
  get password() {
    return this.loginForm.value.password;
  }

  constructor(
    public activeTenantResolver: ActiveTenantResolver,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.loginForm = new FormGroup({
      username: new FormControl<string>(
        { value: '', disabled: false },
        { nonNullable: true, validators: [Validators.required, Validators.email] }
      ),
      password: new FormControl<string>(
        { value: '', disabled: false },
        { nonNullable: true, validators: [Validators.required] }
      ),
    });
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.errorCode = params.errorCode;
    });
  }

  submit() {
    this.submitted = true;
    this.messages = [];
    if (this.loginForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService
      .attemptAuth(this.username, this.password)
      .pipe(
        take(1),
        tap(() => {
          this.isLoading = false;
          this.submitted = false;
          this.activatedRoute.queryParams.subscribe((params) => {
            this.router.navigate([this.activeTenantResolver.resolve().slug, params.redirect].filter(negate(isNil)));
          });
        }),
        catchError((err) => {
          this.messages = [
            { severity: 'error', summary: 'Warning', detail: 'Unable to login at this time, please try again later' },
          ];
          this.isLoading = false;
          this.submitted = false;
          return throwError(() => err);
        })
      )
      .subscribe();
  }
}
