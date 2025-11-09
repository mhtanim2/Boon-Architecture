# Development Guide

## Overview

This comprehensive guide covers the development workflow, setup procedures, coding standards, and best practices for working with the Boon Fashion Management System. It provides detailed instructions for both frontend and backend development, testing, and deployment.

## Development Environment Setup

### Prerequisites

#### Required Software
- **Node.js**: v18.x or later (check `.nvmrc` for exact version)
- **npm**: v8.x or later
- **Angular CLI**: v16.x or later
- **Docker**: v20.x or later
- **Docker Compose**: v2.x or later
- **MySQL**: v8.0 or later (or use Docker)
- **Git**: v2.x or later

#### Recommended Tools
- **VS Code**: With official extensions
- **Postman**: For API testing
- **MySQL Workbench**: For database management
- **DBeaver**: Alternative database tool

### Project Setup

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd "RMP Project"
```

#### 2. Install Dependencies
```bash
# Main application dependencies
cd boon
npm install

# Pagination library dependencies
cd ../nestjs-paginate-boon
npm install
```

#### 3. Environment Configuration
```bash
# Copy environment templates
cd boon
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# Configure environment variables
# See Environment Variables section below
```

#### 4. Database Setup
```bash
# Option 1: Using Docker (recommended)
docker-compose up -d mysql

# Option 2: Local MySQL
# Create database and user manually
mysql -u root -p
CREATE DATABASE boon_dev;
CREATE USER 'boon_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON boon_dev.* TO 'boon_user'@'localhost';
FLUSH PRIVILEGES;
```

#### 5. Run Database Migrations
```bash
cd boon
nx migration:run
```

#### 6. Start Development Services
```bash
# Start all services (API, Web, MailHog, Seq)
npm run dev

# Or start individually
nx serve api
nx serve web
```

### Environment Variables

#### Backend (apps/api/.env)
```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=boon_user
DB_PASSWORD=your_password
DB_DATABASE=boon_dev

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION=24h
JWT_REFRESH_EXPIRATION=7d

# Mail Configuration
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password
MAIL_FROM=noreply@boon.com

# Logging
LOG_LEVEL=info
SEQ_URL=http://localhost:5341

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,application/pdf

# Redis (for caching)
REDIS_HOST=localhost
REDIS_PORT=6379

# CORS
CORS_ORIGIN=http://localhost:4200
```

#### Frontend (apps/web/.env)
```bash
# API Configuration
API_BASE_URL=http://localhost:3333/api

# Application Settings
APP_NAME=Boon Fashion Management
APP_VERSION=2.0.0

# Feature Flags
ENABLE_ANALYTICS=false
ENABLE_DEBUG=true
```

## Development Workflow

### Daily Development Routine

#### 1. Start Development Environment
```bash
# Navigate to project root
cd boon

# Pull latest changes
git pull origin main

# Install new dependencies (if any)
npm install

# Start all services
npm run dev
```

#### 2. Development Services URLs
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:3333
- **API Documentation**: http://localhost:3333/api
- **Seq Logging**: http://localhost:5341
- **MailHog**: http://localhost:8025

#### 3. Common Development Commands
```bash
# Generate new component (Angular)
nx g component articles/article-detail --project=web

# Generate new module (NestJS)
nx g module reporting --project=api

# Generate new controller
nx g controller reports --project=api

# Generate new service
nx g service article --project=api

# Run linting
nx lint

# Format code
nx format

# Run tests
nx test

# Run E2E tests
npm run test:e2e
```

### Git Workflow

#### Branch Strategy
```
main                    # Production-ready code
├── develop            # Integration branch
├── feature/article-ui # Feature branch
├── feature/api-auth   # Feature branch
└── hotfix/bug-fix     # Hotfix branch
```

#### Commit Naming Convention
```bash
# Feature commits
feat: add article photo upload functionality
feat: implement user authentication with JWT

# Bug fixes
fix: resolve article pagination issue
fix: correct tenant isolation bug

# Documentation
docs: update API documentation
docs: add development setup guide

# Configuration
config: update database configuration
config: add new environment variables

# Refactoring
refactor: optimize database queries
refactor: improve component performance

# Testing
test: add unit tests for article service
test: add E2E tests for user login
```

#### Pull Request Process
1. **Create Feature Branch**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Make Changes and Commit**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

3. **Push and Create PR**
   ```bash
   git push origin feature/new-feature
   # Create pull request in GitHub/GitLab
   ```

4. **PR Template**
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing
   - [ ] Unit tests pass
   - [ ] Integration tests pass
   - [ ] E2E tests pass
   - [ ] Manual testing completed

   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Self-review completed
   - [ ] Documentation updated
   - [ ] Environment variables documented
   ```

## Frontend Development

### Angular Development Standards

#### Component Structure
```typescript
// articles.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  articles$ = new BehaviorSubject<Article[]>([]);
  loading$ = new BehaviorSubject<boolean>(false);

  ngOnInit(): void {
    this.loadArticles();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadArticles(): void {
    // Implementation
  }
}
```

#### Service Pattern
```typescript
// article.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private readonly API_URL = '/api/articles';

  private articles$ = new BehaviorSubject<Article[]>([]);

  constructor(private http: HttpClient) {}

  getArticles(): Observable<Article[]> {
    return this.articles$.asObservable();
  }

  loadArticles(params?: any): Observable<Article[]> {
    return this.http.get<Article[]>(this.API_URL, { params });
  }

  createArticle(article: CreateArticleDto): Observable<Article> {
    return this.http.post<Article>(this.API_URL, article);
  }
}
```

#### Reactive Forms with Validation
```typescript
// article-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-article-form',
  templateUrl: './article-form.component.html'
})
export class ArticleFormComponent implements OnInit {
  articleForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit(): void {}

  private createForm(): void {
    this.articleForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      sku: ['', [Validators.required, Validators.pattern(/^[A-Z0-9-]+$/)]],
      price: [0, [Validators.required, Validators.min(0)]],
      categoryId: ['', Validators.required],
      description: ['', Validators.maxLength(2000)]
    });
  }

  onSubmit(): void {
    if (this.articleForm.valid) {
      // Submit logic
    }
  }
}
```

### PrimeNG Integration

#### Table Component
```html
<p-table
  [value]="articles$ | async"
  [lazy]="true"
  (onLazyLoad)="loadArticles($event)"
  [totalRecords]="totalRecords$ | async"
  [loading]="loading$ | async"
  [paginator]="true"
  [rows]="10"
  [globalFilterFields]="['title', 'sku', 'category.name']"
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
      <td *ngFor="let col of columns">
        {{ article[col.field] }}
      </td>
      <td>
        <button pButton type="button" icon="pi pi-eye"
                (click)="viewArticle(article)"></button>
        <button pButton type="button" icon="pi pi-edit"
                (click)="editArticle(article)"></button>
      </td>
    </tr>
  </ng-template>
</p-table>
```

#### Form Components
```html
<form [formGroup]="articleForm" (ngSubmit)="onSubmit()">
  <div class="p-field">
    <label for="title">Title</label>
    <input pInputText id="title" formControlName="title"
           [class.ng-invalid]="articleForm.get('title')?.invalid && articleForm.get('title')?.touched">
    <small *ngIf="articleForm.get('title')?.invalid && articleForm.get('title')?.touched"
           class="p-error">Title is required</small>
  </div>

  <div class="p-field">
    <label for="price">Price</label>
    <p-inputNumber id="price" formControlName="price"
                   mode="currency" currency="USD" [min]="0">
    </p-inputNumber>
  </div>

  <div class="p-field">
    <label for="category">Category</label>
    <p-dropdown id="category" formControlName="categoryId"
                [options]="categories$" optionLabel="name" optionValue="id"
                placeholder="Select a category">
    </p-dropdown>
  </div>

  <p-footer>
    <button pButton type="submit" label="Save" [disabled]="articleForm.invalid"></button>
    <button pButton type="button" label="Cancel" (click)="cancel()"></button>
  </p-footer>
</form>
```

### State Management with RxAngular

#### Reactive Component Pattern
```typescript
@Component({
  selector: 'app-article-list',
  template: `
    <div class="article-list">
      <p-spinner *ngIf="loading$ | async"></p-spinner>

      <div *ngIf="error$ | async as error" class="error-message">
        {{ error }}
      </div>

      <div *ngIf="articles$ | async as articles">
        <app-article-card
          *ngFor="let article of articles; trackBy: trackByArticleId"
          [article]="article"
          (edit)="editArticle$.next($event)"
          (delete)="deleteArticle$.next($event)">
        </app-article-card>
      </div>
    </div>
  `
})
export class ArticleListComponent implements OnInit {
  // State streams
  articles$ = new BehaviorSubject<Article[]>([]);
  loading$ = new BehaviorSubject<boolean>(false);
  error$ = new BehaviorSubject<string | null>(null);

  // Action streams
  loadArticles$ = new Subject<void>();
  editArticle$ = new Subject<Article>();
  deleteArticle$ = new Subject<Article>();

  constructor(private articleService: ArticleService) {
    this.setupReactiveLogic();
  }

  ngOnInit(): void {
    this.loadArticles$.next();
  }

  private setupReactiveLogic(): void {
    this.loadArticles$.pipe(
      tap(() => this.loading$.next(true)),
      switchMap(() => this.articleService.getArticles()),
      takeUntilDestroyed(this)
    ).subscribe({
      next: (articles) => {
        this.articles$.next(articles);
        this.loading$.next(false);
        this.error$.next(null);
      },
      error: (error) => {
        this.error$.next(error.message);
        this.loading$.next(false);
      }
    });

    this.deleteArticle$.pipe(
      switchMap((article) => this.articleService.deleteArticle(article.id)),
      takeUntilDestroyed(this)
    ).subscribe({
      next: () => this.loadArticles$.next(),
      error: (error) => this.error$.next(error.message)
    });
  }

  trackByArticleId(index: number, article: Article): string {
    return article.id;
  }
}
```

## Backend Development

### NestJS Development Standards

#### Module Structure
```typescript
// articles.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { Article } from '../database/entities/article.entity';
import { Photo } from '../database/entities/photo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Photo])],
  controllers: [ArticlesController],
  providers: [ArticlesService],
  exports: [ArticlesService]
})
export class ArticlesModule {}
```

#### Service Pattern
```typescript
// articles.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { Article } from '../database/entities/article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PaginationDto } from './dto/pagination.dto';
import { PaginatedResult } from '../interfaces/paginated-result.interface';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>
  ) {}

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    const article = this.articleRepository.create(createArticleDto);
    return this.articleRepository.save(article);
  }

  async findAll(paginationDto: PaginationDto): Promise<PaginatedResult<Article>> {
    const { page, limit, search, categoryId, minPrice, maxPrice } = paginationDto;

    const queryBuilder = this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.category', 'category')
      .leftJoinAndSelect('article.photos', 'photos')
      .where('article.tenantId = :tenantId', { tenantId: paginationDto.tenantId });

    if (search) {
      queryBuilder.andWhere(
        '(article.title LIKE :search OR article.sku LIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (categoryId) {
      queryBuilder.andWhere('article.categoryId = :categoryId', { categoryId });
    }

    if (minPrice !== undefined && maxPrice !== undefined) {
      queryBuilder.andWhere('article.price BETWEEN :minPrice AND :maxPrice', {
        minPrice,
        maxPrice
      });
    }

    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('article.createdAt', 'DESC')
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findOne(id: string): Promise<Article> {
    return this.articleRepository.findOne({
      where: { id },
      relations: ['category', 'photos', 'client']
    });
  }

  async update(id: string, updateArticleDto: UpdateArticleDto): Promise<Article> {
    await this.articleRepository.update(id, updateArticleDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.articleRepository.delete(id);
  }
}
```

#### Controller Pattern
```typescript
// articles.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PaginationDto } from './dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../auth/guards/tenant.guard';

@ApiTags('articles')
@ApiBearerAuth()
@Controller('articles')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new article' })
  @ApiResponse({ status: 201, description: 'Article created successfully' })
  create(@Body() createArticleDto: CreateArticleDto, @Request() req) {
    return this.articlesService.create({
      ...createArticleDto,
      tenantId: req.tenant.id,
      createdBy: req.user.id
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all articles with pagination' })
  findAll(@Query() paginationDto: PaginationDto, @Request() req) {
    return this.articlesService.findAll({
      ...paginationDto,
      tenantId: req.tenant.id
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get article by ID' })
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update article' })
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articlesService.update(id, updateArticleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete article' })
  @ApiResponse({ status: 204, description: 'Article deleted successfully' })
  remove(@Param('id') id: string) {
    return this.articlesService.remove(id);
  }
}
```

### DTO Validation with Zod
```typescript
// dto/create-article.dto.ts
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CreateArticleSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  sku: z.string().min(1, 'SKU is required').regex(/^[A-Z0-9-]+$/, 'Invalid SKU format'),
  description: z.string().max(2000, 'Description too long').optional(),
  price: z.number().positive('Price must be positive'),
  costPrice: z.number().positive('Cost price must be positive').optional(),
  categoryId: z.string().uuid('Invalid category ID'),
  clientId: z.string().uuid('Invalid client ID').optional(),
  attributes: z.record(z.unknown()).optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['draft', 'active', 'inactive', 'discontinued']).default('draft'),
  visibility: z.enum(['public', 'private', 'unlisted']).default('public')
});

export class CreateArticleDto extends createZodDto(CreateArticleSchema) {}
```

### Database Repository Pattern
```typescript
// repositories/article.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Article } from '../entities/article.entity';

@Injectable()
export class ArticleRepository {
  constructor(
    @InjectRepository(Article)
    private readonly repository: Repository<Article>
  ) {}

  createQueryBuilder(alias = 'article'): SelectQueryBuilder<Article> {
    return this.repository.createQueryBuilder(alias);
  }

  async findByTenantId(tenantId: string): Promise<Article[]> {
    return this.repository.find({
      where: { tenantId },
      relations: ['category', 'photos']
    });
  }

  async findBySku(tenantId: string, sku: string): Promise<Article | null> {
    return this.repository.findOne({
      where: { tenantId, sku },
      relations: ['category']
    });
  }

  async findWithFilters(
    tenantId: string,
    filters: any
  ): Promise<[Article[], number]> {
    const queryBuilder = this.createQueryBuilder()
      .leftJoinAndSelect('article.category', 'category')
      .leftJoinAndSelect('article.photos', 'photos')
      .where('article.tenantId = :tenantId', { tenantId });

    if (filters.categoryId) {
      queryBuilder.andWhere('article.categoryId = :categoryId', {
        categoryId: filters.categoryId
      });
    }

    if (filters.status) {
      queryBuilder.andWhere('article.status = :status', {
        status: filters.status
      });
    }

    if (filters.search) {
      queryBuilder.andWhere(
        '(article.title LIKE :search OR article.description LIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    return queryBuilder.getManyAndCount();
  }
}
```

## Testing Strategy

### Unit Testing

#### Frontend Unit Tests
```typescript
// article-card.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArticleCardComponent } from './article-card.component';
import { Article } from '../../interfaces/article.interface';

describe('ArticleCardComponent', () => {
  let component: ArticleCardComponent;
  let fixture: ComponentFixture<ArticleCardComponent>;
  const mockArticle: Article = {
    id: '1',
    title: 'Test Article',
    sku: 'TEST-001',
    price: 99.99,
    status: 'active',
    category: { id: '1', name: 'Clothing' }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArticleCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleCardComponent);
    component = fixture.componentInstance;
    component.article = mockArticle;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display article title', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.article-title').textContent).toContain('Test Article');
  });

  it('should emit edit event when edit button clicked', () => {
    spyOn(component.edit, 'emit');
    const editButton = fixture.nativeElement.querySelector('.edit-button');
    editButton.click();
    expect(component.edit.emit).toHaveBeenCalledWith(mockArticle);
  });
});
```

#### Backend Unit Tests
```typescript
// articles.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesService } from './articles.service';
import { Article } from '../database/entities/article.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('ArticlesService', () => {
  let service: ArticlesService;
  let repository: jest.Mocked<Repository<Article>>;

  const mockArticle = {
    id: '1',
    title: 'Test Article',
    sku: 'TEST-001',
    price: 99.99
  };

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        {
          provide: getRepositoryToken(Article),
          useValue: mockRepository
        }
      ]
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
    repository = module.get(getRepositoryToken(Article));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an article', async () => {
    const createDto = {
      title: 'Test Article',
      sku: 'TEST-001',
      price: 99.99
    };

    repository.create.mockReturnValue(mockArticle);
    repository.save.mockResolvedValue(mockArticle);

    const result = await service.create(createDto);

    expect(repository.create).toHaveBeenCalledWith(createDto);
    expect(repository.save).toHaveBeenCalledWith(mockArticle);
    expect(result).toEqual(mockArticle);
  });
});
```

### Integration Testing

#### API Integration Tests
```typescript
// articles.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';

describe('Articles API (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Login and get token
    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password'
      });

    authToken = loginResponse.body.data.accessToken;
  });

  describe('/api/articles (POST)', () => {
    it('should create a new article', () => {
      const createDto = {
        title: 'Test Article',
        sku: 'TEST-001',
        price: 99.99,
        categoryId: 'category-id'
      };

      return request(app.getHttpServer())
        .post('/api/articles')
        .set('Authorization', `Bearer ${authToken}`)
        .set('X-Tenant-Slug', 'test-tenant')
        .send(createDto)
        .expect(201)
        .expect((res) => {
          expect(res.body.data.title).toBe(createDto.title);
          expect(res.body.data.sku).toBe(createDto.sku);
        });
    });

    it('should validate required fields', () => {
      return request(app.getHttpServer())
        .post('/api/articles')
        .set('Authorization', `Bearer ${authToken}`)
        .set('X-Tenant-Slug', 'test-tenant')
        .send({})
        .expect(400);
    });
  });

  describe('/api/articles (GET)', () => {
    it('should return paginated articles', () => {
      return request(app.getHttpServer())
        .get('/api/articles')
        .set('Authorization', `Bearer ${authToken}`)
        .set('X-Tenant-Slug', 'test-tenant')
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toBeInstanceOf(Array);
          expect(res.body.meta.pagination).toBeDefined();
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
```

### E2E Testing with Cypress

#### Cypress Test Example
```typescript
// cypress/integration/articles.spec.ts
describe('Article Management', () => {
  beforeEach(() => {
    // Login
    cy.visit('/auth/login');
    cy.get('[data-cy=email]').type('admin@example.com');
    cy.get('[data-cy=password]').type('password');
    cy.get('[data-cy=login-button]').click();
    cy.url().should('include', '/dashboard');
  });

  it('should create a new article', () => {
    cy.visit('/articles');
    cy.get('[data-cy=create-article-button]').click();

    // Fill form
    cy.get('[data-cy=article-title]').type('Test Article');
    cy.get('[data-cy=article-sku]').type('TEST-001');
    cy.get('[data-cy=article-price]').type('99.99');
    cy.get('[data-cy=category-select]').click();
    cy.get('[data-cy=category-option]').first().click();

    // Submit
    cy.get('[data-cy=save-button]').click();

    // Verify
    cy.get('[data-cy=success-message]').should('be.visible');
    cy.url().should('include', '/articles');
    cy.get('[data-cy=article-list]').should('contain', 'Test Article');
  });

  it('should filter articles by category', () => {
    cy.visit('/articles');
    cy.get('[data-cy=category-filter]').click();
    cy.get('[data-cy=filter-option]').first().click();

    cy.get('[data-cy=article-list]').should('be.visible');
  });
});
```

## Build and Deployment

### Production Build

#### Frontend Build
```bash
# Build for production
nx build web --prod

# Build with specific environment
nx build web --configuration=production

# Build analysis (bundle analyzer)
nx build web --prod --stats-json
npx webpack-bundle-analyzer dist/apps/web/stats.json
```

#### Backend Build
```bash
# Build for production
nx build api --prod

# Build Docker image
docker build -t boon-api .
docker build -t boon-web -f apps/web/Dockerfile .
```

### Docker Configuration

#### Backend Dockerfile
```dockerfile
# apps/api/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS runtime

WORKDIR /app

# Copy built application
COPY --from=builder /app/node_modules ./node_modules
COPY dist ./dist

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

USER nodejs

EXPOSE 3333

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3333/health || exit 1

CMD ["node", "dist/apps/api/main.js"]
```

#### Frontend Dockerfile
```dockerfile
# apps/web/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build --prod

FROM nginx:alpine

COPY --from=builder /app/dist/apps/web /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Environment-Specific Configurations

#### Production Environment
```bash
# .env.production
NODE_ENV=production

# Database
DB_HOST=prod-mysql.example.com
DB_PORT=3306
DB_USERNAME=boon_prod_user
DB_PASSWORD=secure_production_password
DB_DATABASE=boon_prod

# Security
JWT_SECRET=super-secure-production-secret-key
JWT_EXPIRATION=24h

# Performance
REDIS_HOST=prod-redis.example.com
REDIS_PORT=6379

# Monitoring
SEQ_URL=https://seq.example.com
LOG_LEVEL=warn
```

### CI/CD Pipeline

#### GitHub Actions Example
```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: password
          MYSQL_DATABASE: boon_test
        ports:
          - 3306:3306
        options: --health-cmd="mysqladmin ping" --health-interval=10s --health-timeout=5s --health-retries=3

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linting
        run: nx lint

      - name: Run unit tests
        run: nx test --coverage

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload coverage
        uses: codecov/codecov-action@v3

  build:
    needs: test
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build applications
        run: |
          nx build api --prod
          nx build web --prod

      - name: Build Docker images
        run: |
          docker build -t boon-api:${{ github.sha }} .
          docker build -t boon-web:${{ github.sha }} -f apps/web/Dockerfile .

      - name: Push to registry
        if: github.ref == 'refs/heads/main'
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker push boon-api:${{ github.sha }}
          docker push boon-web:${{ github.sha }}
```

## Performance Optimization

### Frontend Optimization

#### Lazy Loading
```typescript
// app-routing.module.ts
const routes: Routes = [
  {
    path: 'articles',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/articles/articles.module').then(m => m.ArticlesModule)
  }
];
```

#### TrackBy Functions
```typescript
@Component({
  selector: 'app-article-list',
  template: `
    <div *ngFor="let article of articles; trackBy: trackByArticleId">
      {{ article.title }}
    </div>
  `
})
export class ArticleListComponent {
  trackByArticleId(index: number, article: Article): string {
    return article.id;
  }
}
```

#### OnPush Change Detection
```typescript
@Component({
  selector: 'app-article-card',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleCardComponent {
  @Input() article: Article;
}
```

### Backend Optimization

#### Database Query Optimization
```typescript
// Optimized query with specific fields
async findOptimized(tenantId: string): Promise<Article[]> {
  return this.articleRepository.find({
    where: { tenantId },
    select: ['id', 'title', 'sku', 'price', 'status'],
    relations: ['category'],
    order: { createdAt: 'DESC' },
    take: 50
  });
}
```

#### Caching Strategy
```typescript
import { Cache } from 'cache-manager';

@Injectable()
export class ArticlesService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private articleRepository: ArticleRepository
  ) {}

  async findPopular(): Promise<Article[]> {
    const cacheKey = 'popular_articles';

    let articles = await this.cacheManager.get<Article[]>(cacheKey);

    if (!articles) {
      articles = await this.articleRepository.find({
        where: { status: 'active' },
        order: { viewCount: 'DESC' },
        take: 10
      });

      await this.cacheManager.set(cacheKey, articles, 300); // 5 minutes
    }

    return articles;
  }
}
```

This comprehensive development guide provides all the necessary information for developers to work effectively with the Boon Fashion Management System, from initial setup through deployment and optimization.