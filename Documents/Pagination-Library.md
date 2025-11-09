# nestjs-paginate-boon Library Documentation

## Overview

`nestjs-paginate-boon` is a custom fork of the popular `nestjs-paginate` library, specifically enhanced for the Boon Fashion Management System. It provides advanced pagination, filtering, and sorting capabilities for NestJS applications with TypeORM integration.

## Features

### Core Features
- **Advanced Filtering**: Support for complex query operators
- **JSON:API Compliance**: Standardized response format
- **Multi-tenant Support**: Built-in tenant isolation
- **Custom Operators**: Extended set of filtering operators
- **Virtual Columns**: Support for computed fields
- **Relationship Paging**: Pagination on related entities
- **Performance Optimized**: Efficient query generation

### Enhanced Features (Boon-specific)
- **Tenant-aware Filtering**: Automatic tenant context
- **Fashion Industry Operators**: Specialized filters for fashion data
- **Bulk Operations**: Support for bulk CRUD operations
- **Audit Trail**: Built-in audit logging
- **Caching Integration**: Redis caching support
- **Export Functionality**: CSV/Excel export capabilities

## Installation

### Basic Installation
```bash
npm install nestjs-paginate-boon
```

### Peer Dependencies
```bash
npm install typeorm @nestjs/common @nestjs/core
```

## Quick Start

### 1. Import the Module
```typescript
// app.module.ts
import { PaginateModule } from 'nestjs-paginate-boon';

@Module({
  imports: [
    PaginateModule.forRoot({
      // Global configuration
      defaultLimit: 20,
      maxLimit: 100,
      relativePaths: false,
    }),
  ],
})
export class AppModule {}
```

### 2. Configure for Entity
```typescript
// article.entity.ts
import { Entity, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Paginate, PaginateQuery, FilterOperator } from 'nestjs-paginate-boon';

@Entity('articles')
export class Article {
  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column()
  price: number;

  @ApiProperty()
  @Column()
  status: string;

  // Configure pagination for this entity
  static _alias = 'article';
  static _relations = ['category', 'photos'];
  static _sortableColumns = ['id', 'title', 'price', 'createdAt'];
  static _searchableColumns = ['title', 'description'];
  static _selectableColumns = [
    'id', 'title', 'sku', 'price', 'status', 'createdAt'
  ];
  static _defaultSortBy = [['createdAt', 'DESC']];

  static _filterableColumns = {
    id: true,
    title: [FilterOperator.EQ, FilterOperator.ILIKE],
    price: {
      operators: [FilterOperator.GTE, FilterOperator.LTE],
      default: [FilterOperator.GTE, FilterOperator.LTE]
    },
    status: true,
    categoryId: true,
    'attributes.material': FilterOperator.ILIKE,
    'tags': FilterOperator.IN
  };
}
```

### 3. Use in Controller
```typescript
// articles.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Paginate, PaginateQuery } from 'nestjs-paginate-boon';
import { ArticlesService } from './articles.service';
import { Article } from './article.entity';

@ApiTags('articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  async findAll(@Paginate() query: PaginateQuery<Article>) {
    return this.articlesService.findAll(query);
  }
}
```

### 4. Use in Service
```typescript
// articles.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate-boon';
import { Article } from './article.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>
  ) {}

  async findAll(query: PaginateQuery<Article>): Promise<Paginated<Article>> {
    return paginate(query, this.articleRepository, {
      sortableColumns: ['id', 'title', 'price', 'createdAt'],
      searchableColumns: ['title', 'description'],
      defaultSortBy: [['createdAt', 'DESC']],
      filterableColumns: {
        id: true,
        title: true,
        price: true,
        status: true,
        categoryId: true
      },
      where: {
        tenantId: query.tenantId // Multi-tenant support
      }
    });
  }
}
```

## Advanced Usage

### Custom Filtering Operators

#### Available Operators
```typescript
export enum FilterOperator {
  EQ = '$eq',          // Equals
  NE = '$ne',          // Not equals
  GT = '$gt',          // Greater than
  GTE = '$gte',        // Greater than or equal
  LT = '$lt',          // Less than
  LTE = '$lte',        // Less than or equal
  BTW = '$btw',        // Between
  IN = '$in',          // In array
  NIN = '$nin',        // Not in array
  LIKE = '$like',      // SQL LIKE
  ILIKE = '$ilike',    // Case-insensitive LIKE
  SW = '$sw',          // Starts with
  EW = '$ew',          // Ends with
  CONTAINS = '$contains', // JSON contains
  NULL = '$null',      // IS NULL
  NOTNULL = '$notnull' // IS NOT NULL
}

// Fashion industry specific operators
export enum FashionFilterOperator {
  SIZE_RANGE = '$sizeRange',    // Size range filter
  COLOR_FAMILY = '$colorFamily', // Color family filter
  SEASON = '$season',          // Season filter
  COLLECTION = '$collection'   // Collection filter
}
```

#### Custom Operator Example
```typescript
// Filter by price range with currency conversion
@Get()
async findByPriceRange(@Paginate() query: PaginateQuery<Article>) {
  // Query: ?filter[price][$btw]=100,500
  return this.articlesService.findByPriceRange(query);
}
```

### Multi-tenant Configuration

#### Tenant-aware Filtering
```typescript
// tenant-aware.service.ts
@Injectable()
export class TenantAwareService {
  async findAll(query: PaginateQuery<Article>): Promise<Paginated<Article>> {
    // Automatically filter by current tenant
    const tenantId = this.getCurrentTenantId();

    return paginate(query, this.repository, {
      where: {
        tenantId,
        ...query.where // Merge with additional filters
      },
      // ... other options
    });
  }

  private getCurrentTenantId(): string {
    // Extract tenant from request context
    return this.request.tenant?.id;
  }
}
```

#### Tenant Override
```typescript
// Allow admin to access all tenants
@Get('admin/all')
async findAllTenants(@Paginate() query: PaginateQuery<Article>) {
  if (this.user.hasRole('admin')) {
    return paginate(query, this.repository, {
      // No tenant filtering for admins
    });
  }

  throw new ForbiddenException();
}
```

### Relationship Pagination

#### Paginate with Relations
```typescript
// Get articles with paginated photos
@Get(':id/photos')
async getArticlePhotos(
  @Param('id') id: string,
  @Paginate() query: PaginateQuery<Photo>
) {
  return this.photosService.findByArticle(id, query);
}

// Service method
async findByArticle(articleId: string, query: PaginateQuery<Photo>) {
  return paginate(query, this.photoRepository, {
    where: {
      articleId,
      tenantId: this.getCurrentTenantId()
    },
    sortableColumns: ['id', 'order', 'createdAt'],
    defaultSortBy: [['order', 'ASC']]
  });
}
```

#### Nested Relations
```typescript
// Get articles with category and client info
async findAllWithRelations(query: PaginateQuery<Article>) {
  return paginate(query, this.articleRepository, {
    relations: ['category', 'client', 'photos'],
    select: [
      'article.id', 'article.title', 'article.price',
      'category.id', 'category.name',
      'client.id', 'client.name'
    ],
    where: {
      tenantId: this.getCurrentTenantId()
    }
  });
}
```

### Virtual Columns and Computed Fields

#### Virtual Column Configuration
```typescript
// article.entity.ts
@Entity('articles')
export class Article {
  // ... regular columns

  @Column({ type: 'json', nullable: true })
  attributes: Record<string, any>;

  // Configure virtual columns for pagination
  static _virtualColumns = {
    photoCount: `
      (SELECT COUNT(*) FROM photos
       WHERE photos.articleId = article.id AND photos.tenantId = article.tenantId)
    `,
    hasDiscount: `
      (CASE WHEN article.discountPrice > 0 AND article.discountPrice < article.price
       THEN true ELSE false END)
    `,
    materialType: `JSON_EXTRACT(article.attributes, '$.material')`,
    availableSizes: `JSON_EXTRACT(article.attributes, '$.sizes')`
  };
}
```

#### Using Virtual Columns
```typescript
// Use in queries
@Get()
async findAll(@Paginate() query: PaginateQuery<Article>) {
  return paginate(query, this.repository, {
    virtualColumns: Article._virtualColumns,
    sortableColumns: ['photoCount', 'price'],
    filterableColumns: {
      photoCount: true,
      hasDiscount: true,
      materialType: [FilterOperator.EQ, FilterOperator.ILIKE]
    }
  });
}
```

### Fashion Industry Specific Features

#### Size Range Filtering
```typescript
// Size range operator usage
// Query: ?filter[attributes.sizes][$sizeRange]=M,XL

const sizeRangeFilter = {
  'attributes.sizes': {
    $sizeRange: ['M', 'XL']
  }
};
```

#### Color Family Filtering
```typescript
// Color family operator
// Query: ?filter[attributes.color][$colorFamily]=blue

const colorFamilyFilter = {
  'attributes.color': {
    $colorFamily: 'blue' // Matches blue, navy, sky, etc.
  }
};
```

#### Seasonal Filtering
```typescript
// Season-based filtering
// Query: ?filter[attributes.season][$in]=summer,spring

const seasonFilter = {
  'attributes.season': {
    $in: ['summer', 'spring']
  }
};
```

### Export Functionality

#### CSV Export
```typescript
@Get('export')
async exportToCsv(@Paginate() query: PaginateQuery<Article>) {
  const result = await this.articlesService.findAll({
    ...query,
    limit: 10000 // Large limit for export
  });

  const csv = await this.generateCsv(result.data);

  return new StreamableFile(csv, {
    type: 'text/csv',
    disposition: `attachment; filename="articles_${Date.now()}.csv"`
  });
}

private async generateCsv(articles: Article[]): Promise<Buffer> {
  const csv = [
    'ID,Title,SKU,Price,Status,Category,Created At'
  ];

  for (const article of articles) {
    csv.push([
      article.id,
      article.title,
      article.sku,
      article.price,
      article.status,
      article.category?.name || '',
      article.createdAt.toISOString()
    ].join(','));
  }

  return Buffer.from(csv.join('\n'));
}
```

### Caching Integration

#### Redis Caching
```typescript
@Injectable()
export class CachedArticlesService {
  constructor(
    private readonly articlesService: ArticlesService,
    private readonly cacheManager: Cache
  ) {}

  async findAll(query: PaginateQuery<Article>): Promise<Paginated<Article>> {
    const cacheKey = this.generateCacheKey(query);

    // Try cache first
    const cached = await this.cacheManager.get<Paginated<Article>>(cacheKey);
    if (cached) {
      return cached;
    }

    // Execute query
    const result = await this.articlesService.findAll(query);

    // Cache for 5 minutes
    await this.cacheManager.set(cacheKey, result, 300);

    return result;
  }

  private generateCacheKey(query: PaginateQuery): string {
    return `articles:${JSON.stringify({
      page: query.page,
      limit: query.limit,
      filter: query.filter,
      search: query.search,
      sortBy: query.sortBy
    })}`;
  }
}
```

### Bulk Operations

#### Bulk Update with Pagination
```typescript
@Patch('bulk')
async bulkUpdate(
  @Body() bulkUpdateDto: BulkUpdateDto,
  @Paginate() query: PaginateQuery<Article>
) {
  // Get IDs matching filter
  const matchingArticles = await this.articlesService.findAll({
    ...query,
    select: ['id'],
    limit: 1000
  });

  const ids = matchingArticles.data.map(article => article.id);

  // Perform bulk update
  await this.articleRepository.update(ids, bulkUpdateDto.updates);

  // Return updated results
  return this.articlesService.findAll(query);
}
```

## Configuration Options

### Global Module Configuration
```typescript
PaginateModule.forRoot({
  // Pagination defaults
  defaultLimit: 20,
  maxLimit: 100,
  relativePaths: false,

  // Configuration sources
  loadConfiguration: true, // Load from entity decorators
  defaultSortBy: [['createdAt', 'DESC']],

  // Query customization
  querySerializer: querySerializer, // Custom query serializer

  // Multi-tenant settings
  tenantColumn: 'tenantId',
  autoTenantFilter: true,

  // Performance settings
  cache: {
    enabled: true,
    ttl: 300, // 5 minutes
    keyGenerator: (query) => `paginate:${JSON.stringify(query)}`
  },

  // Export settings
  export: {
    enabled: true,
    maxExportRows: 50000,
    formats: ['csv', 'xlsx'],
    defaultFields: ['id', 'title', 'sku', 'price', 'status']
  }
});
```

### Entity-level Configuration
```typescript
export class Article {
  // ... fields

  static _alias = 'article';
  static _relations = ['category', 'photos', 'client'];
  static _sortableColumns = [
    'id', 'title', 'sku', 'price', 'status', 'createdAt', 'updatedAt'
  ];
  static _searchableColumns = ['title', 'description', 'sku'];
  static _selectableColumns = [
    'id', 'title', 'sku', 'price', 'costPrice', 'status', 'visibility',
    'createdAt', 'updatedAt', 'publishedAt'
  ];
  static _defaultSortBy = [['createdAt', 'DESC']];
  static _filterableColumns = {
    id: true,
    title: [FilterOperator.EQ, FilterOperator.ILIKE],
    sku: [FilterOperator.EQ, FilterOperator.ILIKE],
    price: {
      operators: [FilterOperator.GTE, FilterOperator.LTE],
      default: [FilterOperator.GTE, FilterOperator.LTE]
    },
    costPrice: {
      operators: [FilterOperator.GTE, FilterOperator.LTE]
    },
    status: {
      operators: [FilterOperator.EQ, FilterOperator.IN],
      default: FilterOperator.EQ
    },
    visibility: true,
    categoryId: true,
    clientId: true,
    'attributes.material': FilterOperator.ILIKE,
    'attributes.color': FilterOperator.ILIKE,
    'attributes.size': [FilterOperator.EQ, FilterOperator.IN],
    tags: FilterOperator.IN,
    createdAt: {
      operators: [FilterOperator.GTE, FilterOperator.LTE]
    },
    updatedAt: {
      operators: [FilterOperator.GTE, FilterOperator.LTE]
    }
  };

  // Fashion-specific configurations
  static _fashionFilters = {
    sizeRange: {
      field: 'attributes.sizes',
      operator: FashionFilterOperator.SIZE_RANGE
    },
    colorFamily: {
      field: 'attributes.color',
      operator: FashionFilterOperator.COLOR_FAMILY
    },
    season: {
      field: 'attributes.season',
      operator: FashionFilterOperator.SEASON
    },
    collection: {
      field: 'attributes.collection',
      operator: FashionFilterOperator.COLLECTION
    }
  };

  // Virtual columns for computed values
  static _virtualColumns = {
    photoCount: `
      (SELECT COUNT(*) FROM photos
       WHERE photos.articleId = article.id AND photos.tenantId = article.tenantId)
    `,
    revisionCount: `
      (SELECT COUNT(*) FROM revisions
       WHERE revisions.articleId = article.id AND revisions.tenantId = article.tenantId)
    `,
    isOnSale: `
      (CASE WHEN article.discountPrice > 0
       AND article.discountPrice < article.price THEN true ELSE false END)
    `,
    mainCategory: `
      (SELECT c.name FROM categories c
       WHERE c.id = article.categoryId LIMIT 1)
    `
  };

  // Export configuration
  static _exportConfig = {
    allowedFormats: ['csv', 'xlsx', 'json'],
    defaultFields: [
      'id', 'title', 'sku', 'price', 'costPrice', 'status',
      'category.name', 'client.name', 'createdAt'
    ],
    sensitiveFields: ['costPrice'],
    fieldMappings: {
      'category.name': 'Category',
      'client.name': 'Client',
      'createdAt': 'Created Date'
    }
  };
}
```

## Query Examples

### Basic Pagination
```http
GET /articles?page=1&limit=20
```

### Sorting
```http
GET /articles?sortBy=price:asc,createdAt:desc
```

### Searching
```http
GET /articles?search=shirt
```

### Basic Filtering
```http
GET /articles?filter[status][$eq]=active&filter[price][$gte]=100
```

### Array Filtering
```http
GET /articles?filter[status][$in]=active,draft&filter[categoryId][$in]=1,2,3
```

### Text Search with Operators
```http
GET /articles?filter[title][$ilike]=%cotton%&filter[description][$contains]=organic
```

### Date Range Filtering
```http
GET /articles?filter[createdAt][$gte]=2023-01-01&filter[createdAt][$lte]=2023-12-31
```

### JSON Attribute Filtering
```http
GET /articles?filter[attributes.material][$eq]=cotton&filter[attributes.color][$ilike]=%blue%
```

### Fashion-Specific Filtering
```http
GET /articles?filter[attributes.sizes][$sizeRange]=M,XL&filter[attributes.season][$eq]=summer
```

### Combined Query Example
```http
GET /articles?page=2&limit=30&sortBy=price:asc&search=dress&filter[status][$eq]=active&filter[categoryId][$eq]=5&filter[price][$btw]=50,200&filter[attributes.material][$eq]=silk&filter[tags][$in]=elegant,summer
```

## Response Format

### JSON:API Compliant Response
```json
{
  "data": [
    {
      "id": "1",
      "title": "Silk Summer Dress",
      "sku": "DRESS-001",
      "price": 150.00,
      "status": "active",
      "category": {
        "id": "5",
        "name": "Dresses"
      },
      "attributes": {
        "material": "silk",
        "color": "blue",
        "sizes": ["S", "M", "L"],
        "season": "summer"
      },
      "photoCount": 5,
      "isOnSale": false,
      "createdAt": "2023-06-15T10:30:00Z"
    }
  ],
  "meta": {
    "totalItems": 156,
    "itemCount": 30,
    "itemsPerPage": 30,
    "totalPages": 6,
    "currentPage": 2,
    "filters": {
      "status": {
        "$eq": "active"
      },
      "categoryId": {
        "$eq": "5"
      },
      "price": {
        "$btw": "50,200"
      },
      "attributes.material": {
        "$eq": "silk"
      },
      "tags": {
        "$in": "elegant,summer"
      }
    },
    "search": "dress",
    "sortBy": [
      {
        "field": "price",
        "direction": "ASC"
      }
    ]
  },
  "links": {
    "first": "http://localhost:3333/api/articles?page=1&limit=30",
    "previous": "http://localhost:3333/api/articles?page=1&limit=30",
    "current": "http://localhost:3333/api/articles?page=2&limit=30",
    "next": "http://localhost:3333/api/articles?page=3&limit=30",
    "last": "http://localhost:3333/api/articles?page=6&limit=30"
  }
}
```

## Performance Considerations

### Database Indexes
```sql
-- Composite indexes for common filter combinations
CREATE INDEX idx_articles_tenant_status ON articles(tenant_id, status);
CREATE INDEX idx_articles_tenant_category ON articles(tenant_id, category_id);
CREATE INDEX idx_articles_tenant_price ON articles(tenant_id, price);

-- Full-text search index
CREATE FULLTEXT INDEX ft_articles_search ON articles(title, description);

-- JSON attribute indexes (MySQL 8.0+)
CREATE INDEX idx_articles_material ON articles((JSON_EXTRACT(attributes, '$.material')));
CREATE INDEX idx_article_sizes ON articles((CAST(attributes->'$.sizes' AS JSON ARRAY)));
```

### Query Optimization
```typescript
// Use specific fields instead of SELECT *
const result = await paginate(query, this.repository, {
  select: ['id', 'title', 'price', 'status'], // Only needed fields
  where: {
    tenantId: this.getCurrentTenantId(),
    status: 'active'
  }
});

// Use relationships efficiently
const result = await paginate(query, this.repository, {
  relations: {
    category: true,
    photos: {
      where: { isPrimary: true }
    }
  }
});
```

### Caching Strategy
```typescript
// Cache expensive queries
const result = await this.cacheManager.wrap(
  `articles:${JSON.stringify(query)}`,
  () => this.expensiveQuery(query),
  { ttl: 300 } // 5 minutes
);
```

## Error Handling

### Custom Error Types
```typescript
export class PaginationException extends HttpException {
  constructor(message: string, status: HttpStatus) {
    super({
      error: 'PaginationError',
      message,
      timestamp: new Date().toISOString()
    }, status);
  }
}

// Usage in service
if (query.limit > 1000) {
  throw new PaginationException('Limit exceeds maximum allowed', HttpStatus.BAD_REQUEST);
}
```

### Validation Errors
```typescript
// Validate filter operators
private validateFilters(filters: any): void {
  for (const [field, filter] of Object.entries(filters)) {
    if (!this.isFilterableField(field)) {
      throw new BadRequestException(`Cannot filter by field: ${field}`);
    }

    for (const operator of Object.keys(filter)) {
      if (!this.isValidOperator(operator)) {
        throw new BadRequestException(`Invalid operator: ${operator}`);
      }
    }
  }
}
```

## Testing

### Unit Tests
```typescript
describe('Articles Pagination', () => {
  let service: ArticlesService;
  let repository: Repository<Article>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ArticlesService,
        {
          provide: getRepositoryToken(Article),
          useValue: mockRepository
        }
      ]
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
    repository = module.get<Repository<Article>>(getRepositoryToken(Article));
  });

  it('should paginate articles with filters', async () => {
    const query: PaginateQuery = {
      page: 1,
      limit: 10,
      filter: {
        status: { $eq: 'active' },
        price: { $gte: 100 }
      }
    };

    const result = await service.findAll(query);

    expect(result.meta.totalItems).toBeGreaterThan(0);
    expect(result.data).toHaveLength(10);
    expect(repository.createQueryBuilder).toHaveBeenCalled();
  });
});
```

### Integration Tests
```typescript
describe('Articles Pagination (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('should return paginated articles', () => {
    return request(app.getHttpServer())
      .get('/articles?page=1&limit=5')
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.meta).toBeDefined();
        expect(res.body.links).toBeDefined();
      });
  });

  it('should apply filters correctly', () => {
    return request(app.getHttpServer())
      .get('/articles?filter[status][$eq]=active&filter[price][$gte]=100')
      .expect(200)
      .expect((res) => {
        expect(res.body.data.every(article =>
          article.status === 'active' && article.price >= 100
        )).toBe(true);
      });
  });
});
```

This comprehensive documentation provides all the information needed to effectively use the `nestjs-paginate-boon` library in the Boon Fashion Management System, from basic usage to advanced features and optimizations.