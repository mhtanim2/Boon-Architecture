# Boon Fashion Management System - Project Overview

## Business Domain

The Boon system is a comprehensive **multi-tenant fashion product management platform** designed to streamline the entire product lifecycle for fashion businesses. The system manages fashion articles ("articoli") across multiple clients, providing tools for product cataloging, photo management, revision tracking, and client-specific customizations.

### Core Business Features

- **Product Management**: Complete lifecycle management of fashion articles with specifications, pricing, and status tracking
- **Multi-Client Support**: Serve multiple fashion brands with isolated data and customized workflows
- **Media Management**: Comprehensive photo and document upload system with organization and metadata
- **Revision Control**: Track product changes and maintain version history
- **Template System**: Customizable email templates using MJML for client communication
- **User Management**: Role-based access control with hierarchical permissions
- **Reporting & Analytics**: Data insights and performance metrics

## System Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Angular SPA   │    │   NestJS API    │    │   MySQL DB      │
│   (Frontend)    │◄──►│   (Backend)     │◄──►│   (Database)    │
│   Port: 4200    │    │   Port: 3333    │    │   Port: 3306    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         │              │   Seq Logs      │              │
         └──────────────►│   Port: 5341    │◄─────────────┘
                        └─────────────────┘
                        ┌─────────────────┐
                        │   MailHog       │
                        │   Port: 8025    │
                        └─────────────────┘
```

## Technology Stack

### Frontend (boon-web)
- **Framework**: Angular 16 with Ivy renderer
- **UI Components**: PrimeNG component library
- **State Management**: RxAngular for reactive patterns
- **Build Tool**: Webpack via Angular CLI
- **Language**: TypeScript with strict mode

### Backend (boon-api)
- **Framework**: NestJS 10 (Node.js-based)
- **Database ORM**: TypeORM with MySQL
- **Authentication**: JWT with refresh tokens
- **Validation**: Zod schemas
- **API Documentation**: OpenAPI/Swagger
- **Logging**: Pino with Seq integration
- **Email**: MJML templates with Nodemailer

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Provisioning**: Ansible playbooks
- **Development Services**: MailHog (email testing), Seq (logging)
- **Database**: MySQL 8.0

### Custom Libraries
- **nestjs-paginate-boon**: Enhanced pagination and filtering library

## Architectural Principles

### 1. Multi-Tenancy
- **Slug-based Isolation**: Each client has a unique slug identifier
- **Data Separation**: Automatic tenant context filtering
- **Customization**: Client-specific configurations and templates

### 2. Clean Architecture
- **Separation of Concerns**: Business logic isolated from infrastructure
- **Modular Design**: Feature-based organization
- **Shared Libraries**: Common functionality extracted to reusable libraries

### 3. API-First Design
- **RESTful Services**: Standardized HTTP methods and status codes
- **OpenAPI Documentation**: Auto-generated API specifications
- **Version Support**: API versioning for backward compatibility

### 4. Security First
- **Defense in Depth**: Multiple layers of security controls
- **Input Validation**: Comprehensive request/response validation
- **Authentication**: Multi-factor authentication support

## Project Structure

```
RMP Project/
├── boon/                          # Main application monorepo
│   ├── apps/
│   │   ├── api/                   # NestJS backend application
│   │   └── web/                   # Angular frontend application
│   ├── libs/
│   │   ├── database/              # TypeORM entities and config
│   │   ├── interfaces/            # Shared TypeScript interfaces
│   │   ├── mailer/                # Email service and templates
│   │   └── shared/                # Common utilities and guards
│   ├── tools/                     # Build and deployment tools
│   └── docker-compose.yml         # Development services
├── nestjs-paginate-boon/          # Custom pagination library
├── boon-ansible-provisioning/     # Infrastructure automation
├── Documents/                     # Project documentation
└── CLAUDE.md                      # AI assistant guidance
```

## Development Workflow

### 1. Local Development
```bash
# Start all services
cd boon
npm run dev

# Services started:
# - API: http://localhost:3333
# - Web: http://localhost:4200
# - Seq: http://localhost:5341
# - MailHog: http://localhost:8025
```

### 2. Database Management
```bash
# Generate migration
nx migration:generate --name AddNewEntity

# Run migrations
nx migration:run

# Generate entities from database
nx run tool:tomg
```

### 3. API Development
```bash
# Generate OpenAPI client code
nx run tool:openapig

# Access API documentation
# http://localhost:3333/api
```

## Key Performance Considerations

### Database Optimization
- **Indexing Strategy**: Optimized queries for tenant filtering
- **Connection Pooling**: Efficient database connection management
- **Query Optimization**: TypeORM query builder for complex operations

### Frontend Performance
- **Lazy Loading**: On-demand module loading
- **Bundle Optimization**: Tree-shaking and code splitting
- **Caching Strategy**: Browser and CDN caching

### API Performance
- **Rate Limiting**: Request throttling for protection
- **Caching**: Redis integration for frequent queries
- **Pagination**: Efficient data loading with custom library

## Security Features

### Authentication & Authorization
- **JWT Tokens**: Secure authentication with refresh tokens
- **Magic Links**: Passwordless authentication option
- **Role-Based Access**: Hierarchical permission system
- **Session Management**: Secure token handling

### Data Protection
- **Input Validation**: Zod schema validation
- **SQL Injection Prevention**: TypeORM parameterized queries
- **File Upload Security**: Type validation and scanning
- **CORS Configuration**: Proper cross-origin controls

### Infrastructure Security
- **HTTPS Enforcement**: SSL/TLS encryption
- **Security Headers**: Helmet.js protection
- **Environment Isolation**: Separate configs per environment

## Monitoring & Observability

### Logging
- **Structured Logging**: Pino with consistent format
- **Centralized Collection**: Seq aggregation service
- **Log Levels**: Debug, Info, Warn, Error with context

### Error Handling
- **Global Filters**: Centralized error processing
- **Response Formatting**: Consistent error responses
- **Monitoring**: Application health checks

## Deployment Strategy

### Container Deployment
```bash
# Build production images
docker build -t boon-api .
docker build -t boon-web .

# Deploy with Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

### Infrastructure Automation
- **Ansible Playbooks**: Automated server provisioning
- **Configuration Management**: Environment-specific setups
- **Rolling Updates**: Zero-downtime deployment strategy

## Future Roadmap

### Planned Enhancements
- **Real-time Features**: WebSocket integration for live updates
- **Advanced Analytics**: Machine learning insights
- **Mobile Application**: React Native mobile client
- **Microservices**: Service decomposition for scalability

### Technology Evolution
- **GraphQL**: API query language for flexible data fetching
- **Event Sourcing**: Event-driven architecture patterns
- **CQRS**: Command Query Responsibility Segregation
- **Progressive Web App**: Enhanced mobile experience

## Team Collaboration

### Development Standards
- **Code Reviews**: Pull request workflow
- **Automated Testing**: Jest + Cypress test suites
- **Continuous Integration**: Automated build and test pipelines
- **Documentation**: Living technical documentation

### Communication
- **API Documentation**: OpenAPI specifications
- **Code Comments**: Comprehensive inline documentation
- **Architecture Decisions**: Recorded design rationales
- **Knowledge Sharing**: Regular technical discussions