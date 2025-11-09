# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

The RMP Project is a multi-project workspace consisting of:

1. **boon** - An Nx monorepo containing the main application
   - **boon-web**: Angular 16 frontend with PrimeNG UI components
   - **boon-api**: NestJS 10 backend API with TypeORM and MySQL
   - **Libraries**: Shared libraries for database entities, utilities, mailer, and interfaces

2. **nestjs-paginate-boon** - A standalone pagination library for NestJS/TypeORM applications

3. **boon-ansible-provisioning** - Ansible playbooks for infrastructure deployment

## Development Setup

### Prerequisites
- Node.js (check .nvmrc for version)
- Angular CLI
- Docker & Docker Compose
- MySQL (or use Docker Compose setup)

### Installation
```bash
# Install dependencies for the main monorepo
cd boon
npm install

# Install dependencies for the pagination library
cd ../nestjs-paginate-boon
npm install
```

### Environment Configuration
1. Copy environment files:
   ```bash
   cp boon/apps/api/.env.example boon/apps/api/.env
   cp boon/apps/web/.env.example boon/apps/web/.env
   ```

2. Configure database connection and other environment variables

3. Start Docker services for development:
   ```bash
   cd boon
   docker-compose up -d  # Starts MailHog and Seq logging
   ```

## Project Structure

### Boon Monorepo Layout
```
boon/
├── apps/
│   ├── api/          # NestJS backend application
│   └── web/          # Angular frontend application
├── libs/
│   ├── database/     # TypeORM entities and database configuration
│   ├── interfaces/   # Shared TypeScript interfaces
│   ├── mailer/       # Email service with templates
│   └── shared/       # Common utilities and guards
├── tools/            # Build and deployment tools
└── docker-compose.yml
```

### Key Architectural Patterns
- **Clean Architecture**: Separation of concerns with domain logic in libs
- **Feature Modules**: Organize by business feature
- **Shared Libraries**: Common functionality extracted to libraries
- **API Design**: RESTful endpoints with automatic OpenAPI documentation

## Development Guidelines

### Code Organization
- Use Nx libraries for shared functionality
- Place business logic in appropriate libraries, not directly in apps
- Follow Angular/NestJS naming conventions
- Use TypeScript strict mode (already configured)

### Validation & Schemas
- Use Zod for request/response validation
- Validation schemas automatically generate OpenAPI docs
- Place schemas in shared modules or feature-specific modules

### Database Patterns
- Use TypeORM entities defined in `libs/database`
- Implement custom repositories when needed
- Support for stored procedures and database views
- Use migrations for schema changes

### Authentication
- JWT-based authentication implemented
- Magic login support available
- Guards and decorators for route protection

## Common Commands

### Development Server
```bash
# Serve both API and web in development mode
cd boon
npm run dev

# Serve applications individually
nx serve api
nx serve web
```

### Building
```bash
# Build all projects
cd boon
nx build

# Build specific project
nx build api --prod
nx build web --prod
```

### Testing
```bash
# Run all tests
cd boon
nx test

# Run tests with coverage
nx test --coverage

# Run e2e tests
npm run test:e2e

# Run tests for pagination library
cd ../nestjs-paginate-boon
npm test
```

### Linting & Formatting
```bash
# Lint all projects
nx lint

# Format code
nx format

# Run pre-commit hooks manually (Husky configured)
nx lint --fix
```

### Database Operations
```bash
# Generate migration
nx migration:generate --name MigrationName

# Run migrations
nx migration:run

# Drop database (development only)
nx schema:drop
```

## Testing Strategy

### Unit Testing
- Framework: Jest
- Location: `**/*.spec.ts` files
- Coverage: Aim for >80% coverage
- Mock external dependencies

### Integration Testing
- Test API endpoints with real database
- Use test database configuration
- Clean up test data after each test

### E2E Testing
- Framework: Cypress
- Location: `apps/web/cypress/`
- Test critical user journeys
- Run against staging environment before releases

## Key Libraries & Tools

### Frontend (boon-web)
- **PrimeNG**: UI component library
- **RxAngular**: Enhanced reactivity patterns
- **Angular Router**: Client-side routing
- **Angular Forms**: Template and reactive forms

### Backend (boon-api)
- **NestJS**: Application framework
- **TypeORM**: Database ORM
- **MySQL**: Primary database
- **Passport**: Authentication middleware
- **Swagger**: API documentation

### Development Tools
- **Nx**: Monorepo management
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Husky**: Git hooks
- **Pino**: Structured logging
- **Seq**: Log aggregation

## API Documentation

- Swagger UI available at: `http://localhost:3333/api` (when API is running)
- OpenAPI specification auto-generated from decorators and Zod schemas
- Use proper decorators (`@ApiTags`, `@ApiOperation`) for better docs

## Logging

- Structured logging with Pino
- Logs sent to Seq when Docker Compose is running
- Access Seq UI at: `http://localhost:5341`

## Email Development

- MailHog provides SMTP server for development
- Access MailHog UI at: `http://localhost:8025`
- Email templates in `libs/mailer`

## Build & Deployment

### Production Build
```bash
# Build optimized production artifacts
cd boon
nx build --prod

# Build Docker images
docker build -t boon-api .
docker build -t boon-web .
```

### Ansible Provisioning
- Located in `boon-ansible-provisioning/`
- Playbooks for:
  - Node.js setup
  - Angular CLI installation
  - Docker configuration
  - Common dependencies

## Troubleshooting

### Common Issues
1. **Port conflicts**: Ensure ports 3333 (API), 4200 (web), 5341 (Seq), 8025 (MailHog) are free
2. **Database connection**: Check MySQL service and connection string in .env
3. **Nx commands**: Run `nx graph` to visualize project dependencies
4. **Migration issues**: Ensure database exists before running migrations

### Performance Tips
- Use `nx affected:*` commands for CI/CD to only build/test changed projects
- Enable incremental builds with caching
- Use lazy loading in Angular modules
- Optimize database queries with TypeORM query builder

### Debugging
- Use Nx console for project visualization
- Angular DevTools for frontend debugging
- NestJS inspector for backend debugging
- Check Seq logs for runtime errors