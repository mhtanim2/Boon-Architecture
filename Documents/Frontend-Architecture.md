# Frontend Architecture Documentation

## Overview

The Boon frontend is a sophisticated **Angular 16 Single Page Application** that provides a rich, responsive interface for the multi-tenant fashion product management system. The architecture follows modern Angular patterns with lazy loading, reactive state management, and a component-based design using PrimeNG.

## Technology Stack

- **Framework**: Angular 16 with Ivy renderer
- **Language**: TypeScript 5.0+ with strict mode
- **UI Components**: PrimeNG 14+ component library
- **State Management**: RxAngular for reactive patterns
- **Build Tool**: Angular CLI with Webpack
- **Styling**: SCSS with CSS custom properties
- **HTTP Client**: Angular HttpClient with interceptors
- **Routing**: Angular Router with lazy loading
- **Forms**: Template-driven and Reactive Forms

## Application Structure

```
src/
├── app/
│   ├── core/                 # Core functionality (singleton services)
│   │   ├── guards/          # Route guards
│   │   ├── interceptors/    # HTTP interceptors
│   │   ├── services/        # Core application services
│   │   └── models/          # Shared data models
│   ├── shared/              # Shared components and utilities
│   │   ├── components/      # Reusable UI components
│   │   ├── directives/      # Custom directives
│   │   ├── pipes/          # Custom pipes
│   │   └── utils/          # Utility functions
│   ├── features/            # Feature modules
│   │   ├── auth/           # Authentication flow
│   │   ├── dashboard/      # Main dashboard
│   │   ├── articles/       # Article management
│   │   ├── clients/        # Client management
│   │   ├── photos/         # Photo management
│   │   ├── users/          # User management
│   │   └── settings/       # Application settings
│   ├── layout/             # Layout components
│   │   ├── header/         # Application header
│   │   ├── sidebar/        # Navigation sidebar
│   │   ├── footer/         # Application footer
│   │   └── main/           # Main content area
│   ├── assets/             # Static assets
│   ├── environments/       # Environment configurations
│   └── styles/            # Global styles
├── index.html              # Application entry point
├── main.ts                 # Application bootstrap
└── polyfills.ts           # Browser polyfills
```

## Core Architecture

### Application Bootstrap (`main.ts`)
```typescript
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
```

### Root Module (`app.module.ts`)
```typescript
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    LayoutModule,
    PrimeNGModule,
    // Feature modules loaded lazily through routing
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: TenantInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### Routing Configuration (`app-routing.module.ts`)
```typescript
const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard, TenantGuard],
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'articles',
    canActivate: [AuthGuard, TenantGuard],
    loadChildren: () => import('./features/articles/articles.module').then(m => m.ArticlesModule)
  },
  {
    path: 'clients',
    canActivate: [AuthGuard, TenantGuard],
    data: { roles: ['admin', 'manager'] },
    loadChildren: () => import('./features/clients/clients.module').then(m => m.ClientsModule)
  },
  // ... other feature routes
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

## Core Module Architecture

### Core Module (`core/core.module.ts`)
The core module provides singleton services and one-time-use components.

```typescript
@NgModule({
  imports: [],
  declarations: [],
  providers: [
    // Singleton services
    AuthService,
    TenantService,
    UserService,
    ApiService,
    StorageService,
    NotificationService,

    // Guards
    AuthGuard,
    TenantGuard,
    RoleGuard,

    // Core services imported as providedIn: 'root'
  ],
  exports: []
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() core: CoreModule) {
    if (core) {
      throw new Error('CoreModule is already loaded. Import it in AppModule only');
    }
  }
}
```

### Authentication Service (`core/services/auth.service.ts`)
```typescript
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';

  private authSubject = new BehaviorSubject<User | null>(null);
  public auth$ = this.authSubject.asObservable();

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private router: Router
  ) {}

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/login', credentials)
      .pipe(
        tap(response => this.handleAuthentication(response)),
        catchError(error => this.handleError(error))
      );
  }

  logout(): void {
    this.clearTokens();
    this.authSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      this.logout();
      return throwError('No refresh token available');
    }

    return this.http.post<AuthResponse>('/api/auth/refresh', { refreshToken })
      .pipe(
        tap(response => this.handleAuthentication(response)),
        catchError(error => {
          this.logout();
          return throwError(error);
        })
      );
  }

  private handleAuthentication(response: AuthResponse): void {
    this.storeTokens(response.accessToken, response.refreshToken);
    this.authSubject.next(response.user);
  }

  private storeTokens(accessToken: string, refreshToken: string): void {
    this.storageService.setItem(this.JWT_TOKEN, accessToken);
    this.storageService.setItem(this.REFRESH_TOKEN, refreshToken);
  }
}
```

### Tenant Service (`core/services/tenant.service.ts`)
```typescript
@Injectable({
  providedIn: 'root'
})
export class TenantService {
  private currentTenantSubject = new BehaviorSubject<Tenant | null>(null);
  public currentTenant$ = this.currentTenantSubject.asObservable();

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  setCurrentTenant(tenant: Tenant): void {
    this.currentTenantSubject.next(tenant);
    this.storageService.setItem('CURRENT_TENANT', JSON.stringify(tenant));
  }

  getCurrentTenant(): Observable<Tenant | null> {
    return this.currentTenant$;
  }

  switchTenant(tenantSlug: string): Observable<Tenant> {
    return this.http.post<Tenant>(`/api/tenants/switch`, { slug: tenantSlug })
      .pipe(
        tap(tenant => this.setCurrentTenant(tenant))
      );
  }
}
```

## HTTP Interceptors

### Authentication Interceptor (`core/interceptors/auth.interceptor.ts`)
```typescript
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getAccessToken();

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(req).pipe(
      catchError(error => {
        if (error.status === 401) {
          return this.handleUnauthorized(req, next);
        }
        return throwError(error);
      })
    );
  }

  private handleUnauthorized(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.refreshToken().pipe(
      switchMap(() => {
        const token = this.authService.getAccessToken();
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
        return next.handle(authReq);
      }),
      catchError(error => {
        this.authService.logout();
        return throwError(error);
      })
    );
  }
}
```

### Tenant Interceptor (`core/interceptors/tenant.interceptor.ts`)
```typescript
@Injectable()
export class TenantInterceptor implements HttpInterceptor {
  constructor(private tenantService: TenantService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip tenant header for auth endpoints
    if (req.url.includes('/api/auth/')) {
      return next.handle(req);
    }

    return this.tenantService.getCurrentTenant().pipe(
      take(1),
      switchMap(tenant => {
        if (tenant) {
          req = req.clone({
            setHeaders: {
              'X-Tenant-Slug': tenant.slug
            }
          });
        }
        return next.handle(req);
      })
    );
  }
}
```

## Feature Module Architecture

### Article Feature Module (`features/articles/articles.module.ts`)
```typescript
@NgModule({
  declarations: [
    ArticlesComponent,
    ArticleListComponent,
    ArticleDetailComponent,
    ArticleFormComponent,
    ArticlePhotoComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ArticlesRoutingModule,
    PrimeNGModule
  ],
  providers: [
    ArticleService,
    PhotoService,
    CategoryService
  ]
})
export class ArticlesModule { }
```

### Article Service (`features/articles/services/article.service.ts`)
```typescript
@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private readonly API_URL = '/api/articles';

  constructor(private http: HttpClient) {}

  getArticles(params: ArticleQueryParams): Observable<PaginatedResponse<Article>> {
    return this.http.get<PaginatedResponse<Article>>(this.API_URL, { params });
  }

  getArticle(id: string): Observable<Article> {
    return this.http.get<Article>(`${this.API_URL}/${id}`);
  }

  createArticle(article: CreateArticleDto): Observable<Article> {
    return this.http.post<Article>(this.API_URL, article);
  }

  updateArticle(id: string, article: UpdateArticleDto): Observable<Article> {
    return this.http.put<Article>(`${this.API_URL}/${id}`, article);
  }

  deleteArticle(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  uploadPhotos(id: string, files: File[]): Observable<Photo[]> {
    const formData = new FormData();
    files.forEach(file => formData.append('photos', file));

    return this.http.post<Photo[]>(`${this.API_URL}/${id}/photos`, formData);
  }
}
```

### Article List Component (`features/articles/components/article-list.component.ts`)
```typescript
@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss']
})
export class ArticleListComponent implements OnInit, OnDestroy {
  articles: Article[] = [];
  loading = false;
  totalRecords = 0;

  searchQuery = '';
  selectedCategory: string = '';

  private destroy$ = new Subject<void>();

  constructor(
    private articleService: ArticleService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadArticles();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadArticles(event?: LazyLoadEvent): void {
    this.loading = true;

    const params: ArticleQueryParams = {
      page: (event?.first || 0) / (event?.rows || 10) + 1,
      limit: event?.rows || 10,
      search: this.searchQuery,
      categoryId: this.selectedCategory,
      sortField: event?.sortField,
      sortOrder: event?.sortOrder
    };

    this.articleService.getArticles(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.articles = response.data;
          this.totalRecords = response.total;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading articles:', error);
          this.loading = false;
        }
      });
  }

  onArticleSelect(article: Article): void {
    this.router.navigate(['/articles', article.id]);
  }

  onArticleDelete(article: Article): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${article.title}"?`,
      accept: () => {
        this.articleService.deleteArticle(article.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Article deleted successfully'
              });
              this.loadArticles();
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete article'
              });
            }
          });
      }
    });
  }
}
```

## PrimeNG Integration

### PrimeNG Configuration (`prime-ng.config.ts`)
```typescript
import { PrimeNGConfig } from 'primeng/api';

export function primeNgConfig(primengConfig: PrimeNGConfig) {
  primengConfig.ripple = true;
  primengConfig.inputStyle = 'outlined';
  primengConfig.showTransitionOptions = '400ms cubic-bezier(0.86, 0, 0.07, 1)';
  primengConfig.hideTransitionOptions = '250ms cubic-bezier(0.86, 0, 0.07, 1)';
}

@NgModule({
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: primeNgConfig,
      deps: [PrimeNGConfig],
      multi: true
    }
  ]
})
export class PrimeNGModule {}
```

### Custom Theme Configuration
```scss
// styles/theme.scss
@import '~primeng/resources/themes/bootstrap4-light/theme.css';
@import '~primeng/resources/primeng.min.css';

:root {
  --primary-color: #2c3e50;
  --primary-light-color: #34495e;
  --text-color: #333333;
  --text-light-color: #666666;
  --surface-color: #ffffff;
  --surface-border-color: #e0e0e0;
}

.p-component {
  font-family: 'Inter', sans-serif;
}

.p-button {
  background-color: var(--primary-color);
  border-color: var(--primary-color);

  &:hover {
    background-color: var(--primary-light-color);
    border-color: var(--primary-light-color);
  }
}

.p-datatable {
  .p-datatable-header {
    background-color: var(--surface-color);
    border-bottom: 1px solid var(--surface-border-color);
  }

  .p-datatable-thead > tr > th {
    background-color: var(--surface-color);
    color: var(--text-color);
    font-weight: 600;
  }
}
```

## State Management with RxAngular

### RxAngular Setup (`core/state/app-state.service.ts`)
```typescript
@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  private readonly state = new BehaviorSubject<AppState>({
    user: null,
    tenant: null,
    loading: false,
    notifications: []
  });

  public readonly state$ = this.state.asObservable();

  select<K extends keyof AppState>(key: K): Observable<AppState[K]> {
    return this.state$.pipe(
      map(state => state[key]),
      distinctUntilChanged()
    );
  }

  setState(newState: Partial<AppState>): void {
    const currentState = this.state.value;
    this.state.next({ ...currentState, ...newState });
  }

  updateState<K extends keyof AppState>(key: K, value: AppState[K]): void {
    const currentState = this.state.value;
    this.state.next({ ...currentState, [key]: value });
  }
}
```

### Reactive Article List with RxAngular
```typescript
@Component({
  selector: 'app-reactive-article-list',
  template: `
    <div class="article-list">
      <p-table
        [value]="articles$ | async"
        [lazy]="true"
        (onLazyLoad)="loadArticles$.next($event)"
        [totalRecords]="totalRecords$ | async"
        [loading]="loading$ | async"
        [paginator]="true"
        [rows]="10"
      >
        <ng-template pTemplate="header">
          <tr>
            <th *ngFor="let col of columns" [pSortableColumn]="col.field">
              {{ col.header }}
              <p-sortIcon [field]="col.field"></p-sortIcon>
            </th>
            <th>Actions</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-article>
          <tr>
            <td *ngFor="let col of columns">{{ article[col.field] }}</td>
            <td>
              <button pButton type="button" icon="pi pi-eye"
                      (click)="selectArticle$.next(article)"></button>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  `
})
export class ReactiveArticleListComponent implements OnInit, OnDestroy {
  // Reactive streams
  articles$ = new BehaviorSubject<Article[]>([]);
  totalRecords$ = new BehaviorSubject<number>(0);
  loading$ = new BehaviorSubject<boolean>(false);

  // Action streams
  loadArticles$ = new Subject<LazyLoadEvent>();
  selectArticle$ = new Subject<Article>();

  private destroy$ = new Subject<void>();

  constructor(
    private articleService: ArticleService,
    private router: Router
  ) {
    this.setupReactiveLogic();
  }

  ngOnInit(): void {
    // Initial load
    this.loadArticles$.next({});
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupReactiveLogic(): void {
    this.loadArticles$.pipe(
      tap(() => this.loading$.next(true)),
      switchMap(event => this.loadArticles(event)),
      takeUntil(this.destroy$)
    ).subscribe({
      next: response => {
        this.articles$.next(response.data);
        this.totalRecords$.next(response.total);
        this.loading$.next(false);
      },
      error: () => this.loading$.next(false)
    });

    this.selectArticle$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(article => {
      this.router.navigate(['/articles', article.id]);
    });
  }

  private loadArticles(event: LazyLoadEvent): Observable<PaginatedResponse<Article>> {
    const params = this.buildQueryParams(event);
    return this.articleService.getArticles(params);
  }
}
```

## Form Handling

### Reactive Form with Validation (`features/articles/components/article-form.component.ts`)
```typescript
@Component({
  selector: 'app-article-form',
  templateUrl: './article-form.component.html'
})
export class ArticleFormComponent implements OnInit {
  articleForm: FormGroup;
  categories: Category[] = [];
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private articleService: ArticleService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadCategories();

    this.route.params.pipe(
      switchMap(params => {
        if (params['id']) {
          return this.loadArticle(params['id']);
        }
        return of(null);
      })
    ).subscribe(article => {
      if (article) {
        this.articleForm.patchValue(article);
      }
    });
  }

  private createForm(): void {
    this.articleForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      sku: ['', [Validators.required, Validators.pattern(/^[A-Z0-9-]+$/)]],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      categoryId: ['', Validators.required],
      status: ['draft', Validators.required],
      attributes: this.fb.group({})
    });
  }

  onSubmit(): void {
    if (this.articleForm.invalid) {
      this.markFormGroupTouched(this.articleForm);
      return;
    }

    this.isSubmitting = true;

    const articleData = this.articleForm.value;
    const operation = this.route.snapshot.params['id']
      ? this.articleService.updateArticle(this.route.snapshot.params['id'], articleData)
      : this.articleService.createArticle(articleData);

    operation.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Article ${this.route.snapshot.params['id'] ? 'updated' : 'created'} successfully`
        });
        this.router.navigate(['/articles']);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to save article'
        });
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
```

## Error Handling

### Global Error Handler (`core/services/error.service.ts`)
```typescript
@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  constructor(
    private messageService: MessageService,
    private router: Router
  ) {}

  handleError(error: any): void {
    console.error('Application Error:', error);

    if (error.status === 401) {
      this.handleUnauthorizedError();
      return;
    }

    if (error.status === 403) {
      this.handleForbiddenError();
      return;
    }

    if (error.status === 404) {
      this.handleNotFoundError();
      return;
    }

    if (error.status >= 500) {
      this.handleServerError();
      return;
    }

    this.handleClientError(error);
  }

  private handleUnauthorizedError(): void {
    this.messageService.add({
      severity: 'warn',
      summary: 'Session Expired',
      detail: 'Please log in again'
    });
    this.router.navigate(['/auth/login']);
  }

  private handleForbiddenError(): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Access Denied',
      detail: 'You do not have permission to access this resource'
    });
  }

  private handleNotFoundError(): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Not Found',
      detail: 'The requested resource was not found'
    });
  }

  private handleServerError(): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Server Error',
      detail: 'An unexpected error occurred. Please try again later.'
    });
  }

  private handleClientError(error: any): void {
    const message = error.error?.message || error.message || 'An error occurred';
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message
    });
  }
}
```

### HTTP Error Interceptor (`core/interceptors/error.interceptor.ts`)
```typescript
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private errorService: ErrorService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(error => {
        this.errorService.handleError(error);
        return throwError(error);
      })
    );
  }
}
```

## Performance Optimization

### Lazy Loading Feature Modules
```typescript
const routes: Routes = [
  {
    path: 'articles',
    canActivate: [AuthGuard, TenantGuard],
    loadChildren: () => import('./features/articles/articles.module').then(m => m.ArticlesModule)
  }
];
```

### OnPush Change Detection Strategy
```typescript
@Component({
  selector: 'app-article-card',
  template: `<div>{{ article.title }}</div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleCardComponent {
  @Input() article: Article;
}
```

### TrackBy Function for List Rendering
```typescript
@Component({
  selector: 'app-article-list',
  template: `
    <div *ngFor="let article of articles; trackBy: trackByArticle">
      {{ article.title }}
    </div>
  `
})
export class ArticleListComponent {
  @Input() articles: Article[];

  trackByArticle(index: number, article: Article): string {
    return article.id;
  }
}
```

## Development Workflow

### Development Server Configuration
```json
// angular.json
"architect": {
  "serve": {
    "builder": "@angular-devkit/build-angular:dev-server",
    "options": {
      "proxyConfig": "proxy.conf.json"
    }
  }
}
```

```json
// proxy.conf.json
{
  "/api": {
    "target": "http://localhost:3333",
    "secure": false,
    "changeOrigin": true
  },
  "/health": {
    "target": "http://localhost:3333",
    "secure": false,
    "changeOrigin": true
  }
}
```

### Build Configuration
```bash
# Development build
ng build

# Production build with optimizations
ng build --prod --aot --buildOptimizer

# Build with specific environment
ng build --configuration staging
```

### Testing Strategy
```typescript
// Component unit test
describe('ArticleListComponent', () => {
  let component: ArticleListComponent;
  let fixture: ComponentFixture<ArticleListComponent>;
  let articleServiceSpy: jasmine.SpyObj<ArticleService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ArticleService', ['getArticles']);

    await TestBed.configureTestingModule({
      declarations: [ArticleListComponent],
      imports: [PrimeNGModule],
      providers: [
        { provide: ArticleService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleListComponent);
    component = fixture.componentInstance;
    articleServiceSpy = TestBed.inject(ArticleService) as jasmine.SpyObj<ArticleService>;
  });

  it('should load articles on init', () => {
    const mockArticles = [{ id: '1', title: 'Test Article' }];
    articleServiceSpy.getArticles.and.returnValue(of({ data: mockArticles, total: 1 }));

    component.ngOnInit();

    expect(articleServiceSpy.getArticles).toHaveBeenCalled();
    expect(component.articles).toEqual(mockArticles);
  });
});
```

This frontend architecture provides a robust, scalable, and maintainable user interface that can handle the complex requirements of a multi-tenant fashion product management system while maintaining excellent performance and user experience.