# API Documentation

## Overview

The Boon Fashion Management System provides a comprehensive **RESTful API** built with **NestJS 10** that supports multi-tenant fashion product management. The API follows REST principles, uses **JSON:API** standards for responses, and includes automatic **OpenAPI/Swagger** documentation generation.

## API Architecture

### Base URL
- **Development**: `http://localhost:3333/api`
- **Production**: `https://api.boon.com/api`
- **Staging**: `https://api-staging.boon.com/api`

### API Versioning
- Current version: **v2**
- Version included in URL: `/api/v2/`
- Previous v1 endpoints deprecated but still supported

### Content Types
- **Request**: `application/json`
- **Response**: `application/vnd.api+json` (JSON:API format)
- **File Upload**: `multipart/form-data`

### Authentication
- **Type**: Bearer Token (JWT)
- **Header**: `Authorization: Bearer <access_token>`
- **Refresh Token**: Available for token renewal

### Multi-Tenancy
- **Header**: `X-Tenant-Slug: <tenant-slug>`
- **Required**: All API calls (except auth endpoints)
- **Purpose**: Data isolation and tenant context

## Authentication Endpoints

### Login with Email/Password
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "roles": ["admin"],
      "tenant": {
        "id": "uuid",
        "name": "Fashion Brand Inc",
        "slug": "fashion-brand"
      }
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 86400
  }
}
```

### Magic Link Authentication
```http
POST /api/auth/magic-link
Content-Type: application/json

{
  "email": "user@example.com",
  "tenantSlug": "fashion-brand"
}
```

**Response:**
```json
{
  "data": {
    "message": "Magic link sent to your email",
    "expiresIn": 900
  }
}
```

### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Logout
```http
POST /api/auth/logout
Authorization: Bearer <access_token>
X-Tenant-Slug: fashion-brand
```

## User Management Endpoints

### Get Current User
```http
GET /api/users/me
Authorization: Bearer <access_token>
X-Tenant-Slug: fashion-brand
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "avatarUrl": "https://example.com/avatar.jpg",
    "roles": ["admin"],
    "preferences": {
      "language": "en",
      "timezone": "UTC",
      "notifications": true
    },
    "lastLoginAt": "2023-12-01T10:30:00Z",
    "createdAt": "2023-01-15T08:00:00Z",
    "updatedAt": "2023-12-01T10:30:00Z"
  }
}
```

### Get All Users (Paginated)
```http
GET /api/users?page=1&limit=10&search=john&status=active
Authorization: Bearer <access_token>
X-Tenant-Slug: fashion-brand
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "status": "active",
      "roles": ["admin"],
      "createdAt": "2023-01-15T08:00:00Z"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

### Create User
```http
POST /api/users
Authorization: Bearer <access_token>
X-Tenant-Slug: fashion-brand
Content-Type: application/json

{
  "email": "newuser@example.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "roles": ["editor"],
  "sendInvitation": true
}
```

### Update User
```http
PATCH /api/users/uuid
Authorization: Bearer <access_token>
X-Tenant-Slug: fashion-brand
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Johnson",
  "preferences": {
    "language": "es",
    "notifications": false
  }
}
```

## Article Management Endpoints

### Get Articles (Paginated with Filtering)
```http
GET /api/articles?page=1&limit=20&category=clothing&status=active&search=shirt&sort=createdAt&order=desc
Authorization: Bearer <access_token>
X-Tenant-Slug: fashion-brand
```

**Advanced Filtering:**
```http
GET /api/articles?filter[price][$gte]=50&filter[price][$lte]=200&filter[attributes][$contains]=cotton
Authorization: Bearer <access_token>
X-Tenant-Slug: fashion-brand
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Premium Cotton Shirt",
      "slug": "premium-cotton-shirt",
      "sku": "SHIRT-001",
      "description": "High-quality cotton shirt for casual wear",
      "price": 89.99,
      "costPrice": 45.00,
      "status": "active",
      "visibility": "public",
      "category": {
        "id": "uuid",
        "name": "Shirts",
        "slug": "shirts"
      },
      "client": {
        "id": "uuid",
        "name": "Fashion Client Co"
      },
      "attributes": {
        "material": "100% Cotton",
        "color": "Blue",
        "size": "M,L,XL"
      },
      "tags": ["casual", "cotton", "summer"],
      "primaryPhoto": {
        "id": "uuid",
        "url": "https://example.com/photo.jpg",
        "altText": "Premium cotton shirt in blue"
      },
      "photoCount": 4,
      "revisionCount": 2,
      "createdAt": "2023-11-20T09:00:00Z",
      "updatedAt": "2023-12-01T14:30:00Z",
      "publishedAt": "2023-11-25T10:00:00Z"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 156,
      "totalPages": 8
    },
    "filters": {
      "availableFilters": [
        {
          "field": "category",
          "type": "select",
          "options": ["clothing", "accessories", "shoes"]
        },
        {
          "field": "price",
          "type": "range",
          "min": 10,
          "max": 500
        }
      ]
    }
  }
}
```

### Get Single Article
```http
GET /api/articles/uuid
Authorization: Bearer <access_token>
X-Tenant-Slug: fashion-brand
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "title": "Premium Cotton Shirt",
    "slug": "premium-cotton-shirt",
    "sku": "SHIRT-001",
    "description": "High-quality cotton shirt for casual wear",
    "price": 89.99,
    "costPrice": 45.00,
    "weight": 0.3,
    "dimensions": {
      "length": 70,
      "width": 50,
      "height": 2
    },
    "status": "active",
    "visibility": "public",
    "seo": {
      "title": "Premium Cotton Shirt | Fashion Brand",
      "description": "Shop our premium cotton shirt..."
    },
    "category": {
      "id": "uuid",
      "name": "Shirts",
      "slug": "shirts"
    },
    "client": {
      "id": "uuid",
      "name": "Fashion Client Co"
    },
    "attributes": {
      "material": "100% Cotton",
      "color": "Blue",
      "size": "M,L,XL",
      "care": "Machine wash cold"
    },
    "tags": ["casual", "cotton", "summer"],
    "photos": [
      {
        "id": "uuid",
        "url": "https://example.com/photo1.jpg",
        "altText": "Front view of cotton shirt",
        "caption": "Premium cotton shirt - front view",
        "order": 1,
        "isPrimary": true,
        "dimensions": {
          "width": 800,
          "height": 600
        }
      },
      {
        "id": "uuid",
        "url": "https://example.com/photo2.jpg",
        "altText": "Back view of cotton shirt",
        "caption": "Premium cotton shirt - back view",
        "order": 2,
        "isPrimary": false,
        "dimensions": {
          "width": 800,
          "height": 600
        }
      }
    ],
    "revisions": [
      {
        "id": "uuid",
        "version": 2,
        "changeSummary": "Updated price and added new photos",
        "status": "published",
        "createdAt": "2023-12-01T14:30:00Z",
        "createdBy": {
          "id": "uuid",
          "firstName": "John",
          "lastName": "Doe"
        }
      }
    ],
    "createdAt": "2023-11-20T09:00:00Z",
    "updatedAt": "2023-12-01T14:30:00Z",
    "publishedAt": "2023-11-25T10:00:00Z"
  }
}
```

### Create Article
```http
POST /api/articles
Authorization: Bearer <access_token>
X-Tenant-Slug: fashion-brand
Content-Type: application/json

{
  "title": "New Fashion Item",
  "sku": "ITEM-001",
  "description": "Description of the new fashion item",
  "price": 99.99,
  "costPrice": 50.00,
  "categoryId": "uuid",
  "clientId": "uuid",
  "attributes": {
    "material": "Cotton",
    "color": "Red",
    "size": "S,M,L"
  },
  "tags": ["new", "fashion", "trending"],
  "status": "draft",
  "visibility": "public",
  "seo": {
    "title": "New Fashion Item | Brand",
    "description": "Shop our latest fashion item"
  }
}
```

### Update Article
```http
PATCH /api/articles/uuid
Authorization: Bearer <access_token>
X-Tenant-Slug: fashion-brand
Content-Type: application/json

{
  "title": "Updated Fashion Item",
  "price": 119.99,
  "status": "active",
  "attributes": {
    "color": "Blue"
  }
}
```

### Delete Article
```http
DELETE /api/articles/uuid
Authorization: Bearer <access_token>
X-Tenant-Slug: fashion-brand
```

## Photo Management Endpoints

### Upload Photos to Article
```http
POST /api/articles/uuid/photos
Authorization: Bearer <access_token>
X-Tenant-Slug: fashion-brand
Content-Type: multipart/form-data

photos[]: [file1.jpg, file2.jpg]
altTexts[]: ["Front view", "Back view"]
captions[]: ["Photo 1 caption", "Photo 2 caption"]
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "url": "https://cdn.boon.com/uploads/photo1.jpg",
      "altText": "Front view",
      "caption": "Photo 1 caption",
      "fileName": "photo1.jpg",
      "fileSize": 2048576,
      "mimeType": "image/jpeg",
      "dimensions": {
        "width": 1200,
        "height": 800
      },
      "order": 1,
      "isPrimary": false,
      "createdAt": "2023-12-01T15:00:00Z"
    }
  ]
}
```

### Update Photo
```http
PATCH /api/photos/uuid
Authorization: Bearer <access_token>
X-Tenant-Slug: fashion-brand
Content-Type: application/json

{
  "altText": "Updated alt text",
  "caption": "Updated caption",
  "order": 2,
  "isPrimary": true
}
```

### Delete Photo
```http
DELETE /api/photos/uuid
Authorization: Bearer <access_token>
X-Tenant-Slug: fashion-brand
```

## Category Management Endpoints

### Get Categories (Tree Structure)
```http
GET /api/categories?include=children&include=articleCount
Authorization: Bearer <access_token>
X-Tenant-Slug: fashion-brand
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Clothing",
      "slug": "clothing",
      "description": "All clothing items",
      "imageUrl": "https://example.com/clothing.jpg",
      "isActive": true,
      "sortOrder": 1,
      "articleCount": 45,
      "children": [
        {
          "id": "uuid",
          "name": "Shirts",
          "slug": "shirts",
          "parentId": "parent-uuid",
          "articleCount": 12,
          "children": []
        }
      ],
      "attributesSchema": {
        "material": {
          "type": "select",
          "options": ["Cotton", "Polyester", "Wool"],
          "required": true
        },
        "size": {
          "type": "multiselect",
          "options": ["XS", "S", "M", "L", "XL"],
          "required": true
        }
      }
    }
  ]
}
```

### Create Category
```http
POST /api/categories
Authorization: Bearer <access_token>
X-Tenant-Slug: fashion-brand
Content-Type: application/json

{
  "name": "New Category",
  "slug": "new-category",
  "description": "Description of new category",
  "parentId": "parent-uuid",
  "attributesSchema": {
    "brand": {
      "type": "text",
      "required": false
    }
  },
  "sortOrder": 10
}
```

## Client Management Endpoints

### Get Clients
```http
GET /api/clients?page=1&limit=20&status=active&search=fashion
Authorization: Bearer <access_token>
X-Tenant-Slug: fashion-brand
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Fashion Client Co",
      "email": "contact@fashionclient.com",
      "phone": "+1-555-0123",
      "website": "https://fashionclient.com",
      "logoUrl": "https://example.com/logo.jpg",
      "address": {
        "street": "123 Fashion St",
        "city": "New York",
        "state": "NY",
        "zip": "10001",
        "country": "USA"
      },
      "billingInfo": {
        "taxId": "12-3456789",
        "paymentTerms": "Net 30"
      },
      "contactPerson": "Jane Smith",
      "notes": "Premium client with high volume orders",
      "status": "active",
      "articleCount": 23,
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-12-01T10:00:00Z"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 12,
      "totalPages": 1
    }
  }
}
```

### Create Client
```http
POST /api/clients
Authorization: Bearer <access_token>
X-Tenant-Slug: fashion-brand
Content-Type: application/json

{
  "name": "New Fashion Client",
  "email": "contact@newclient.com",
  "phone": "+1-555-0456",
  "website": "https://newclient.com",
  "address": {
    "street": "456 Style Ave",
    "city": "Los Angeles",
    "state": "CA",
    "zip": "90001",
    "country": "USA"
  },
  "contactPerson": "John Doe",
  "notes": "New potential client"
}
```

## Revision Management Endpoints

### Get Article Revisions
```http
GET /api/articles/uuid/revisions?page=1&limit=10
Authorization: Bearer <access_token>
X-Tenant-Slug: fashion-brand
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "version": 3,
      "changes": {
        "title": {
          "old": "Old Title",
          "new": "New Title"
        },
        "price": {
          "old": 89.99,
          "new": 99.99
        }
      },
      "changeSummary": "Updated title and price",
      "status": "published",
      "createdAt": "2023-12-01T14:30:00Z",
      "createdBy": {
        "id": "uuid",
        "firstName": "John",
        "lastName": "Doe"
      },
      "publishedBy": {
        "id": "uuid",
        "firstName": "Jane",
        "lastName": "Smith"
      },
      "publishedAt": "2023-12-01T15:00:00Z"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "totalPages": 1
    }
  }
}
```

### Restore Revision
```http
POST /api/revisions/uuid/restore
Authorization: Bearer <access_token>
X-Tenant-Slug: fashion-brand
Content-Type: application/json

{
  "createNewVersion": true,
  "restoreReason": "Restoring previous pricing"
}
```

## Search and Filtering

### Advanced Search
```http
GET /api/search?q=cotton shirt&filters[price][$between]=50,100&filters[category]=clothing&sort=price&order=asc
Authorization: Bearer <access_token>
X-Tenant-Slug: fashion-brand
```

### Available Filter Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `$eq` | Equals | `filters[status][$eq]=active` |
| `$ne` | Not equals | `filters[status][$ne]=deleted` |
| `$gt` | Greater than | `filters[price][$gt]=100` |
| `$gte` | Greater than or equal | `filters[price][$gte]=100` |
| `$lt` | Less than | `filters[price][$lt]=500` |
| `$lte` | Less than or equal | `filters[price][$lte]=500` |
| `$between` | Between range | `filters[price][$between]=100,500` |
| `$in` | In array | `filters[status][$in]=active,draft` |
| `$nin` | Not in array | `filters[status][$nin]=deleted,archived` |
| `$like` | Like (SQL LIKE) | `filters[title][$like]=%shirt%` |
| `$ilike` | Case-insensitive like | `filters[title][$ilike]=%SHIRT%` |
| `$sw` | Starts with | `filters[sku][$sw]=SHIRT-` |
| `$contains` | Contains (JSON) | `filters[attributes][$contains]=cotton` |
| `$null` | Is null | `filters[categoryId][$null]=true` |

### Sorting Options
```http
GET /api/articles?sort=createdAt&order=desc&secondarySort=price&secondaryOrder=asc
```

## File Upload Endpoints

### Upload Generic File
```http
POST /api/files
Authorization: Bearer <access_token>
X-Tenant-Slug: fashion-brand
Content-Type: multipart/form-data

file: [document.pdf]
entityType: article
entityId: uuid
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "originalName": "document.pdf",
    "fileName": "uuid-document.pdf",
    "filePath": "/uploads/2023/12/uuid-document.pdf",
    "fileSize": 1048576,
    "mimeType": "application/pdf",
    "fileHash": "sha256:abc123...",
    "url": "https://cdn.boon.com/uploads/2023/12/uuid-document.pdf",
    "entityType": "article",
    "entityId": "uuid",
    "uploadedBy": {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe"
    },
    "createdAt": "2023-12-01T15:30:00Z"
  }
}
```

## Bulk Operations

### Bulk Update Articles
```http
PATCH /api/articles/bulk
Authorization: Bearer <access_token>
X-Tenant-Slug: fashion-brand
Content-Type: application/json

{
  "ids": ["uuid1", "uuid2", "uuid3"],
  "updates": {
    "status": "active",
    "price": 99.99
  }
}
```

### Bulk Delete Articles
```http
DELETE /api/articles/bulk
Authorization: Bearer <access_token>
X-Tenant-Slug: fashion-brand
Content-Type: application/json

{
  "ids": ["uuid1", "uuid2", "uuid3"]
}
```

## Reporting Endpoints

### Get Article Statistics
```http
GET /api/reports/articles?period=monthly&startDate=2023-11-01&endDate=2023-12-01
Authorization: Bearer <access_token>
X-Tenant-Slug: fashion-brand
```

**Response:**
```json
{
  "data": {
    "summary": {
      "totalArticles": 156,
      "activeArticles": 120,
      "draftArticles": 25,
      "discontinuedArticles": 11,
      "totalValue": 15678.90,
      "averagePrice": 100.51
    },
    "byCategory": [
      {
        "categoryName": "Clothing",
        "articleCount": 89,
        "percentage": 57.05
      }
    ],
    "byStatus": [
      {
        "status": "active",
        "count": 120,
        "percentage": 76.92
      }
    ],
    "timeline": [
      {
        "date": "2023-11-01",
        "created": 5,
        "updated": 12,
        "deleted": 1
      }
    ]
  }
}
```

### Export Data
```http
POST /api/reports/export
Authorization: Bearer <access_token>
X-Tenant-Slug: fashion-brand
Content-Type: application/json

{
  "type": "articles",
  "format": "csv",
  "filters": {
    "status": "active",
    "category": "clothing"
  },
  "fields": ["id", "title", "sku", "price", "status", "createdAt"]
}
```

## Error Responses

### Standard Error Format
```json
{
  "errors": [
    {
      "status": "400",
      "title": "Bad Request",
      "detail": "Validation failed",
      "code": "VALIDATION_ERROR",
      "source": {
        "pointer": "/data/attributes/email",
        "parameter": "email"
      },
      "meta": {
        "validationErrors": [
          {
            "field": "email",
            "message": "Email is required"
          }
        ]
      }
    }
  ],
  "meta": {
    "timestamp": "2023-12-01T15:00:00Z",
    "requestId": "req-uuid",
    "path": "/api/articles"
  }
}
```

### Common HTTP Status Codes

| Status | Meaning | Description |
|--------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 204 | No Content | Request successful, no content returned |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource conflict |
| 422 | Unprocessable Entity | Validation failed |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

### Rate Limiting
- **Standard Rate**: 1000 requests per hour
- **Premium Rate**: 5000 requests per hour
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## Pagination

### Query Parameters
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)
- `offset`: Number of items to skip (alternative to page)

### Response Format
```json
{
  "data": [...],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 156,
      "totalPages": 8,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

## Webhooks

### Create Webhook
```http
POST /api/webhooks
Authorization: Bearer <access_token>
X-Tenant-Slug: fashion-brand
Content-Type: application/json

{
  "url": "https://yourapp.com/webhooks",
  "events": ["article.created", "article.updated", "article.deleted"],
  "secret": "your-webhook-secret",
  "active": true
}
```

### Webhook Payload Example
```json
{
  "event": "article.created",
  "data": {
    "id": "uuid",
    "title": "New Article",
    "createdAt": "2023-12-01T15:00:00Z"
  },
  "tenant": {
    "id": "uuid",
    "slug": "fashion-brand"
  },
  "timestamp": "2023-12-01T15:00:00Z",
  "signature": "sha256=signature"
}
```

## API Client Libraries

### Official SDKs
- **JavaScript/TypeScript**: `@boon/api-client`
- **PHP**: `boon/php-sdk`
- **Python**: `boon-python-sdk`

### Usage Example (TypeScript)
```typescript
import { BoonAPIClient } from '@boon/api-client';

const client = new BoonAPIClient({
  baseURL: 'https://api.boon.com/api',
  accessToken: 'your-access-token',
  tenantSlug: 'fashion-brand'
});

// Get articles
const articles = await client.articles.list({
  page: 1,
  limit: 20,
  filters: {
    status: 'active'
  }
});

// Create article
const article = await client.articles.create({
  title: 'New Article',
  sku: 'NEW-001',
  price: 99.99,
  categoryId: 'uuid'
});
```

## Testing API

### Using curl
```bash
# Login
curl -X POST http://localhost:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Get articles
curl -X GET http://localhost:3333/api/articles \
  -H "Authorization: Bearer your-token" \
  -H "X-Tenant-Slug: fashion-brand"
```

### Using Postman
Import the Postman collection from:
`https://api.boon.com/postman-collection`

This comprehensive API documentation provides developers with all the information needed to integrate with the Boon Fashion Management System effectively.