# Backend Architecture Documentation

## Overview

The Boon backend is a sophisticated **NestJS 10** REST API that implements a multi-tenant fashion product management system. The architecture follows clean architecture principles with separation of concerns, comprehensive security, and scalable design patterns.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    NestJS Application                      │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │ Controllers │  │  Guards     │  │ Interceptors│          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │   Modules   │  │  Services   │  │ Repositories│          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │  TypeORM    │  │   Pino      │  │   Mailer    │          │
│  │  Entities   │  │   Logger    │  │  Service    │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
├─────────────────────────────────────────────────────────────┤
│                    MySQL Database                           │
└─────────────────────────────────────────────────────────────┘
```

## Module Architecture

The backend is organized into **17 distinct modules**, each with specific responsibilities:

### Core Modules

#### 1. **App Module** (`src/app.module.ts`)
- Root module that orchestrates all other modules
- Configures global filters, pipes, and interceptors
- Sets up Swagger documentation
- Database connection configuration

```typescript
@Module({
  imports: [
    // Core modules
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST'),
        port: +config.get('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
        logging: true,
      }),
      inject: [ConfigService],
    }),

    // Feature modules
    AuthModule,
    UsersModule,
    TenantsModule,
    ClientsModule,
    ArticlesModule,
    // ... other modules
  ],
})
export class AppModule {}
```

#### 2. **Auth Module** (`src/auth/auth.module.ts`)
- Handles authentication and authorization
- JWT token management with refresh tokens
- Magic link authentication
- Password hashing and verification
- Role-based access control

```typescript
@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: config.get('JWT_EXPIRATION') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
```

### Business Domain Modules

#### 3. **Users Module** (`src/users/users.module.ts`)
- User management and profile operations
- User role assignments and permissions
- User preferences and settings
- Multi-tenant user access control

#### 4. **Tenants Module** (`src/tenants/tenants.module.ts`)
- Multi-tenant architecture implementation
- Tenant creation and management
- Slug-based tenant identification
- Tenant configuration and settings

#### 5. **Clients Module** (`src/clients/clients.module.ts`)
- Client (fashion brand) management
- Client-specific configurations
- Client-tenant relationships
- Custom branding and templates

#### 6. **Articles Module** (`src/articles/articles.module.ts`)
- Fashion article (product) management
- Product specifications and attributes
- Status tracking and lifecycle management
- Product categorization and tagging

```typescript
@Controller('articles')
@ApiTags('articles')
@UseGuards(JwtAuthGuard)
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new article' })
  @ApiCreatedResponse({ type: Article })
  async create(@Body() createArticleDto: CreateArticleDto) {
    return this.articlesService.create(createArticleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all articles with pagination' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAll(@Query() query: any) {
    return this.articlesService.findAll(query);
  }
}
```

### Supporting Modules

#### 7. **Photos Module** (`src/photos/photos.module.ts`)
- Media upload and management
- Image processing and optimization
- Photo-article relationships
- Storage management and CDN integration

#### 8. **Revisions Module** (`src/revisions/revisions.module.ts`)
- Article revision tracking
- Version control for product changes
- Revision history and comparisons
- Audit trail functionality

#### 9. **Categories Module** (`src/categories/categories.module.ts`)
- Product categorization system
- Hierarchical category structure
- Category-article relationships
- Category-specific attributes

#### 10. **Attributes Module** (`src/attributes/attributes.module.ts`)
- Product attribute definitions
- Dynamic attribute values
- Attribute validation rules
- Custom attribute creation

#### 11. **Files Module** (`src/files/files.module.ts`)
- File upload handling
- Type validation and security scanning
- File storage management
- Access control and permissions

#### 12. **Templates Module** (`src/templates/templates.module.ts`)
- MJML email template management
- Template customization per client
- Template rendering and sending
- Template version control

#### 13. **Notifications Module** (`src/notifications/notifications.module.ts`)
- Real-time notification system
- Email and SMS notifications
- Notification preferences
- Event-driven notifications

#### 14. **Reports Module** (`src/reports/reports.module.ts`)
- Data analytics and reporting
- Custom report generation
- Export functionality
- Performance metrics

#### 15. **Logs Module** (`src/logs/logs.module.ts`)
- Application logging management
- Log aggregation and search
- Audit log functionality
- Performance monitoring

#### 16. **Health Module** (`src/health/health.module.ts`)
- Application health monitoring
- Database connectivity checks
- External service monitoring
- Health endpoint for load balancers

#### 17. **Config Module** (`src/config/config.module.ts`)
- Configuration management
- Environment variable validation
- Dynamic configuration updates
- Settings persistence

## Authentication & Security

### JWT Authentication Flow

```
┌─────────────┐    1. Login Request    ┌─────────────┐
│   Client    │──────────────────────►│   API       │
│             │                       │             │
└─────────────┘    2. Validate User   └─────────────┘
                           │
                           ▼
                   ┌─────────────┐
                   │   Database  │
                   │             │
                   └─────────────┘
                           │
                           ▼
┌─────────────┐    3. JWT Token       ┌─────────────┐
│   Client    │◄──────────────────────│   API       │
│             │                       │             │
└─────────────┘                       └─────────────┘
```

### Security Guards

#### 1. **JWT Authentication Guard** (`src/auth/guards/jwt-auth.guard.ts`)
```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
```

#### 2. **Roles Guard** (`src/auth/guards/roles.guard.ts`)
```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
```

#### 3. **Tenant Guard** (`src/auth/guards/tenant.guard.ts`)
```typescript
@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const tenantSlug = request.headers['x-tenant-slug'];

    if (!tenantSlug) {
      throw new UnauthorizedException('Tenant slug required');
    }

    // Validate tenant exists and user has access
    return this.validateTenantAccess(request.user, tenantSlug);
  }
}
```

### Multi-Tenancy Implementation

#### Tenant Context Middleware
```typescript
@Injectable()
export class TenantContextMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const tenantSlug = req.headers['x-tenant-slug'] as string;

    if (tenantSlug) {
      const tenant = await this.tenantService.findBySlug(tenantSlug);
      if (tenant) {
        req.tenant = tenant;
        // Set TypeORM tenant context
        DataSource.setTenant(tenant.id);
      }
    }

    next();
  }
}
```

#### Tenant-Specific Repository Pattern
```typescript
@Injectable()
export class ArticlesRepository {
  constructor(
    @InjectRepository(Article)
    private repository: Repository<Article>,
  ) {}

  async findAll(tenantId: string, query: any): Promise<PaginatedResult<Article>> {
    return this.repository.find({
      where: { tenantId },
      ...query
    });
  }
}
```

## Data Validation with Zod

### Request/Response Validation
```typescript
// Article DTO with Zod validation
const CreateArticleSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  sku: z.string().min(1),
  price: z.number().positive(),
  categoryId: z.string().uuid(),
  attributes: z.record(z.unknown()).optional(),
  photos: z.array(z.string().url()).optional(),
});

@Post()
@UsePipes(new ZodValidationPipe(CreateArticleSchema))
async create(@Body() createArticleDto: CreateArticleDto) {
  return this.articlesService.create(createArticleDto);
}
```

### Validation Pipe
```typescript
@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: z.ZodSchema) {}

  transform(value: any) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      throw new BadRequestException(error.errors);
    }
  }
}
```

## Database Architecture

### TypeORM Configuration
```typescript
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST'),
        port: +config.get('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/**/migrations/*{.ts,.js}'],
        synchronize: false,
        logging: config.get('NODE_ENV') === 'development',
        timezone: 'Z',
        charset: 'utf8mb4',
        extra: {
          connectionLimit: 10,
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
```

### Entity Relationships
```typescript
@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenantId: string;

  @Column()
  title: string;

  @Column()
  sku: string;

  @ManyToOne(() => Category, (category) => category.articles)
  @JoinColumn()
  category: Category;

  @OneToMany(() => Photo, (photo) => photo.article)
  photos: Photo[];

  @OneToMany(() => Revision, (revision) => revision.article)
  revisions: Revision[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

## API Documentation with Swagger

### OpenAPI Configuration
```typescript
const config = new DocumentBuilder()
  .setTitle('Boon Fashion Management API')
  .setDescription('Multi-tenant fashion product management system')
  .setVersion('2.0')
  .addBearerAuth()
  .addTag('articles')
  .addTag('users')
  .addTag('tenants')
  .build();

export const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);
```

### Controller Decorators
```typescript
@Controller('articles')
@ApiTags('articles')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ArticlesController {
  @Post()
  @ApiOperation({ summary: 'Create a new article' })
  @ApiCreatedResponse({
    description: 'Article created successfully',
    type: Article
  })
  @ApiBearerAuth()
  async create(@Body() createArticleDto: CreateArticleDto) {
    return this.articlesService.create(createArticleDto);
  }
}
```

## Error Handling

### Global Exception Filter
```typescript
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    };

    response.status(status).json(errorResponse);
  }
}
```

## Logging Strategy

### Pino Logger Configuration
```typescript
@Injectable()
export class LoggerService {
  private readonly logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'yyyy-mm-dd HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  });

  log(message: string, context?: string) {
    this.logger.info({ context }, message);
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error({ context, trace }, message);
  }

  warn(message: string, context?: string) {
    this.logger.warn({ context }, message);
  }
}
```

### Seq Integration
```typescript
// In docker-compose.yml
seq:
  image: datalust/seq:latest
  ports:
    - "5341:80"
  environment:
    - ACCEPT_EULA=Y
  volumes:
    - ./seq-data:/data
```

## Performance Optimization

### Caching Strategy
```typescript
@Injectable()
export class ArticlesService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly articlesRepository: ArticlesRepository,
  ) {}

  async findAll(query: any): Promise<PaginatedResult<Article>> {
    const cacheKey = `articles:${JSON.stringify(query)}`;

    let result = await this.cacheManager.get<PaginatedResult<Article>>(cacheKey);

    if (!result) {
      result = await this.articlesRepository.findAll(query);
      await this.cacheManager.set(cacheKey, result, 300); // 5 minutes
    }

    return result;
  }
}
```

### Database Query Optimization
```typescript
@Injectable()
export class ArticlesRepository {
  async findWithFilters(tenantId: string, filters: any): Promise<Article[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.category', 'category')
      .leftJoinAndSelect('article.photos', 'photos')
      .where('article.tenantId = :tenantId', { tenantId });

    if (filters.categoryId) {
      queryBuilder.andWhere('article.categoryId = :categoryId', {
        categoryId: filters.categoryId,
      });
    }

    if (filters.search) {
      queryBuilder.andWhere(
        'article.title LIKE :search OR article.sku LIKE :search',
        { search: `%${filters.search}%` }
      );
    }

    return queryBuilder.getMany();
  }
}
```

## Testing Strategy

### Unit Testing
```typescript
describe('ArticlesService', () => {
  let service: ArticlesService;
  let repository: jest.Mocked<ArticlesRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ArticlesService,
        {
          provide: ArticlesRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
    repository = module.get(ArticlesRepository);
  });

  it('should create an article', async () => {
    const createDto = { title: 'Test Article', sku: 'TEST-001' };
    const expectedArticle = { id: '123', ...createDto };

    repository.create.mockResolvedValue(expectedArticle);

    const result = await service.create(createDto);

    expect(result).toEqual(expectedArticle);
    expect(repository.create).toHaveBeenCalledWith(createDto);
  });
});
```

### Integration Testing
```typescript
describe('ArticlesController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;

  beforeEach(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/articles (POST)', () => {
    return request(app.getHttpServer())
      .post('/articles')
      .send({
        title: 'Test Article',
        sku: 'TEST-001',
        categoryId: 'category-uuid',
      })
      .set('Authorization', 'Bearer valid-token')
      .expect(201);
  });
});
```

## Deployment Configuration

### Environment Variables
```bash
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=boon_user
DB_PASSWORD=secure_password
DB_DATABASE=boon_prod

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION=24h
JWT_REFRESH_EXPIRATION=7d

# Logging
LOG_LEVEL=info
SEQ_URL=http://seq:5341

# Email
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=noreply@boon.com
MAIL_PASS=email_password
```

### Docker Configuration
```dockerfile
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
RUN npm run build
EXPOSE 3333
CMD ["node", "dist/main.js"]
```

This architecture provides a robust, scalable, and maintainable backend system that can handle the complex requirements of a multi-tenant fashion product management platform.