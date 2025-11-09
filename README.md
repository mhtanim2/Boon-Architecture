# RMP Project - Boon Fashion Management System

A comprehensive multi-tenant fashion product management platform built with modern web technologies. This system provides complete product lifecycle management, multi-client support, media management, and revision control for fashion businesses.

## 🚀 Quick Start

**Prerequisites:** Node.js 18+, Docker & Docker Compose, MySQL 8.0

```bash
# Clone the repository
git clone https://github.com/mhtanim2/Boon-Architecture.git
cd Boon-Architecture

# Install all dependencies (monorepo + pagination library)
npm run setup:all

# Start development services (MailHog, Seq)
cd boon && docker-compose up -d

# Configure your environment (see Environment Configuration below)
cp boon/apps/api/.env.example boon/apps/api/.env
cp boon/apps/web/.env.example boon/apps/web/.env

# Start both applications in development mode
cd boon && npm run dev
```

Your applications will be available at:
- **Frontend (Angular):** http://localhost:4200
- **Backend API:** http://localhost:3333
- **API Documentation:** http://localhost:3333/api
- **Logs (Seq):** http://localhost:5341
- **Email Testing (MailHog):** http://localhost:8025

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Development Workflow](#development-workflow)
- [Docker Development](#docker-development)
- [Database Management](#database-management)
- [Testing](#testing)
- [Building for Production](#building-for-production)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Key Libraries & Technologies](#key-libraries--technologies)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## 🎯 Project Overview

The Boon Fashion Management System is a comprehensive B2B platform designed for fashion product management. It provides:

- **Multi-Tenant Architecture:** Complete data isolation between fashion brands/clients
- **Product Lifecycle Management:** From design to distribution with full revision control
- **Media Management:** Advanced photo and asset management with multiple formats
- **Client Management:** Multi-client support with individual branding and workflows
- **Advanced Search & Filtering:** Industry-specific product attributes and filters
- **Reporting & Analytics:** Business intelligence and export capabilities

### Business Domain

Built specifically for the fashion industry, this system handles:
- Seasonal collections and product lines
- Size variations and fit specifications
- Material and composition tracking
- Supplier and manufacturer relationships
- Quality control and compliance documentation

## 🏗️ Architecture

### Technology Stack

**Frontend:**
- **Angular 16** with RxAngular for enhanced reactivity
- **PrimeNG** UI component library with custom theming
- **RxAngular State** for predictable state management
- **TypeScript** with strict mode enabled

**Backend:**
- **NestJS 10** with modular architecture
- **TypeORM** with MySQL 8.0 for data persistence
- **JWT Authentication** with magic login support
- **Zod** for runtime validation and OpenAPI generation

**Infrastructure:**
- **Nx Monorepo** for efficient development and CI/CD
- **Docker** for containerized development services
- **Ansible** for infrastructure provisioning
- **Seq** for structured logging
- **MailHog** for email development testing

### System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Angular SPA   │────│  NestJS API     │────│   MySQL 8.0     │
│   (Port 4200)   │    │  (Port 3333)    │    │  (Port 3306)    │
│                 │    │                 │    │                 │
│ • PrimeNG UI    │    │ • REST/JSON:API │    │ • Multi-tenant  │
│ • RxAngular     │    │ • JWT Auth      │    │ • TypeORM       │
│ • State Mgmt    │    │ • OpenAPI/Swagger│    │ • Migrations    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                    ┌─────────┼─────────┐
                    │         │         │
            ┌───────▼───┐ ┌───▼────┐ ┌──▼──────┐
            │    Seq   │ │MailHog │ │ Redis   │
            │ (Logs)   │ │(Email) │ │(Cache)  │
            │ Port 5341│ │Port 8025│ │Port 6379│
            └──────────┘ └────────┘ └─────────┘
```

## ✅ Prerequisites

### Required Software

1. **Node.js** (v18.x or higher)
   ```bash
   # Install using nvm (recommended)
   nvm install 18
   nvm use 18
   ```

2. **MySQL 8.0+**
   ```bash
   # macOS (using Homebrew)
   brew install mysql
   brew services start mysql

   # Ubuntu/Debian
   sudo apt update
   sudo apt install mysql-server
   sudo systemctl start mysql
   ```

3. **Docker & Docker Compose**
   ```bash
   # Docker Desktop (includes Compose)
   # Download from: https://www.docker.com/products/docker-desktop
   ```

4. **Git**
   ```bash
   # Download from: https://git-scm.com/downloads
   ```

### Global Dependencies

```bash
# Install Angular CLI
npm install -g @angular/cli

# Install Nx CLI (optional, recommended)
npm install -g nx
```

## 📦 Installation

### 1. Clone Repository

```bash
git clone https://github.com/mhtanim2/Boon-Architecture.git
cd Boon-Architecture
```

### 2. Install Dependencies

The project consists of two main components that need separate dependency installation:

```bash
# Install monorepo dependencies (boon/)
cd boon
npm install

# Install pagination library dependencies
cd ../nestjs-paginate-boon
npm install

# Return to project root
cd ..
```

### 3. Setup Helper Script

We've provided a convenience script to handle all dependency installation:

```bash
# Install all dependencies from project root
npm run setup:all
```

This script:
- Installs monorepo dependencies in `boon/`
- Installs pagination library dependencies in `nestjs-paginate-boon/`
- Sets up Git hooks (Husky)
- Applies any package patches

## ⚙️ Environment Configuration

### 1. Create Environment Files

Copy the example environment files and configure them for your environment:

```bash
# API Environment
cp boon/apps/api/.env.example boon/apps/api/.env

# Web Environment
cp boon/apps/web/.env.example boon/apps/web/.env
```

### 2. Database Setup

Create a MySQL database for the application:

```sql
-- Connect to MySQL
mysql -u root -p

-- Create database
CREATE DATABASE boon_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user (recommended for development)
CREATE USER 'boon_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON boon_dev.* TO 'boon_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Environment Variables

#### API Configuration (`boon/apps/api/.env`)

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=boon_user
DB_PASSWORD=secure_password
DB_DATABASE=boon_dev

# Application Configuration
PORT=3333
NODE_ENV=development

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_SECRET=your-refresh-token-secret

# Email Configuration (for MailHog development)
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASS=
SMTP_FROM=noreply@boon.dev

# File Upload Configuration
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760

# Redis Configuration (optional)
REDIS_HOST=localhost
REDIS_PORT=6379

# Seq Logging
SEQ_URL=http://localhost:5341
SEQ_API_KEY=
```

#### Web Configuration (`boon/apps/web/.env`)

```bash
# API Configuration
API_URL=http://localhost:3333
API_TIMEOUT=30000

# Application Configuration
APP_TITLE=Boon Fashion Management
APP_VERSION=2.0.0

# File Upload Configuration
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,application/pdf

# Feature Flags
ENABLE_DEBUG=true
ENABLE_ANALYTICS=false
```

## 🛠️ Development Workflow

### Starting Development Servers

#### Option 1: Start Both Applications

```bash
cd boon
npm run dev
```

This starts both the Angular development server and NestJS API concurrently.

#### Option 2: Start Applications Individually

```bash
# Start API only
cd boon
nx serve api

# Start Web only
cd boon
nx serve web
```

#### Option 3: Start with Docker Services

```bash
# Start supporting services first
cd boon
docker-compose up -d

# Then start applications
npm run dev
```

### Available Scripts

#### Monorepo Commands (`boon/`)

```bash
# Development
npm run dev                    # Start both applications
nx serve api                  # Start API only
nx serve web                  # Start web only

# Building
npm run build                  # Build all projects
nx build api                   # Build API only
nx build web                   # Build web only

# Testing
nx test                        # Run all tests
nx test api                    # Run API tests
nx test web                    # Run web tests
nx test --coverage            # Run with coverage

# Linting & Formatting
nx lint                       # Lint all projects
nx format                     # Format all code
nx format:write               # Format and write changes

# Database Operations
nx migration:generate --name CreateNewTable
nx migration:run
nx migration:revert
nx schema:drop                 # Development only - drops database

# API Documentation
nx run tool:openapig          # Generate OpenAPI specification
```

#### Pagination Library (`nestjs-paginate-boon/`)

```bash
# Development
npm run dev:yalc               # Build and publish locally with yalc

# Testing
npm test                       # Run tests
npm run test:watch            # Watch mode
npm run test:cov              # With coverage

# Building
npm run build                  # Build library
npm run prepare               # Prepare for publishing
```

### Code Generation

```bash
# Generate Angular components
nx g @nx/angular:component my-component --project=web

# Generate NestJS resources
nx g @nx/nest:module my-module --project=api
nx g @nx/nest:controller my-controller --project=api
nx g @nx/nest:service my-service --project=api

# Database entities from existing database
nx run tool:tomg
```

## 🐳 Docker Development

### Development Services

The project includes Docker Compose for development services:

```bash
cd boon
docker-compose up -d
```

This starts:
- **MailHog** (SMTP: 1025, Web: 8025) - Email testing
- **Seq** (Port 5341) - Log aggregation and viewing

### Docker Compose Configuration

```yaml
version: '3.7'

services:
  mailhog:
    image: mailhog/mailhog
    ports:
      - "1025:1025"  # SMTP
      - "8025:8025"  # Web UI

  seq:
    image: datalust/seq
    environment:
      - ACCEPT_EULA=Y
    ports:
      - "5341:80"
    volumes:
      - seq_data:/data

volumes:
  seq_data:
```

### Production Docker Build

```bash
# Build production Docker images
docker build -t boon-api ./apps/api
docker build -t boon-web ./apps/web

# Or use Nx to build
cd boon
nx build api --prod
nx build web --prod
```

## 🗄️ Database Management

### Migrations

Database schema changes are managed through TypeORM migrations:

```bash
# Generate new migration
cd boon
nx migration:generate --name AddNewFeature

# Run pending migrations
nx migration:run

# Revert last migration
nx migration:revert

# Show migration status
nx migration:show
```

### Database Schema

The system uses a multi-tenant database architecture with:

- **34 core entities** for complete fashion product management
- **Tenant isolation** at the database level
- **Audit logging** for all data changes
- **Soft deletes** for data recovery
- **Revision control** for product content

### Database Operations

```bash
# Drop and recreate database (development only)
nx schema:drop

# Generate entities from existing database
nx run tool:tomg

# Connect to database directly
mysql -u boon_user -p boon_dev
```

### Connection Configuration

The API uses TypeORM with MySQL 8.0, configured via environment variables:

```typescript
// Development configuration
{
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  logging: true,
  entities: ['dist/**/entities/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
}
```

## 🧪 Testing

### Testing Strategy

The project employs a comprehensive testing strategy:

1. **Unit Testing** - Jest for individual function/component testing
2. **Integration Testing** - API endpoint testing with test database
3. **E2E Testing** - Cypress for full user journey testing
4. **Visual Testing** - Storybook for component testing (planned)

### Running Tests

```bash
# Run all tests
cd boon
nx test

# Run with coverage
nx test --coverage

# Run tests in watch mode
nx test --watch

# Run specific project tests
nx test api
nx test web

# Run E2E tests
nx e2e web-e2e

# Run pagination library tests
cd ../nestjs-paginate-boon
npm test
```

### Test Configuration

- **Jest** for unit and integration tests
- **Cypress** for E2E testing
- **Coverage reporting** with Istanbul
- **Test databases** isolated from development
- **Mock services** for external dependencies

### Test Environment

Tests run against isolated environments:
- **In-memory database** for API tests
- **JSDOM** for frontend tests
- **Headless browsers** for E2E tests
- **Docker containers** for integration tests

## 🏭 Building for Production

### Production Build

```bash
cd boon

# Build all projects for production
nx build --prod

# Build individual projects
nx build api --prod
nx build web --prod
```

### Build Artifacts

Production builds create optimized artifacts in the `dist/` directory:

```
dist/
├── apps/
│   ├── api/                 # NestJS production build
│   │   ├── main.js
│   │   ├── *.js             # Compiled modules
│   │   └── *.map            # Source maps
│   └── web/                 # Angular production build
│       ├── index.html
│       ├── *.js             # Bundled modules
│       ├── *.css            # Optimized styles
│       └── assets/          # Static assets
├── libs/                    # Library builds
└── migrations/              # Database migrations
```

### Environment-Specific Configuration

Production configuration uses environment variables:

```bash
# Production environment variables
NODE_ENV=production
DB_HOST=your-production-db-host
REDIS_HOST=your-production-redis-host
SEQ_URL=your-production-seq-url
```

### Performance Optimizations

- **Tree shaking** for dead code elimination
- **Code splitting** for lazy loading
- **Minification** of JavaScript and CSS
- **Image optimization** and WebP support
- **Gzip compression** for assets
- **Service Workers** for caching

## 📚 API Documentation

### Swagger/OpenAPI

The API includes comprehensive OpenAPI documentation:

**Access Documentation:** http://localhost:3333/api

### Authentication

All API endpoints (except authentication) require:

```http
Authorization: Bearer <jwt-token>
X-Tenant-Slug: <tenant-slug>
```

### API Examples

```bash
# Login
curl -X POST http://localhost:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Get articles (requires auth)
curl -X GET http://localhost:3333/api/articles \
  -H "Authorization: Bearer your-jwt-token" \
  -H "X-Tenant-Slug: fashion-brand"
```

### API Client Libraries

The project includes TypeScript API client generation:

```bash
# Generate OpenAPI specification
nx run tool:openapig

# Generate client from spec (manual step)
openapi-generator-cli generate -i api-spec.json -g typescript-axios
```

## 📁 Project Structure

```
RMP Project/
├── boon/                              # Main monorepo
│   ├── apps/
│   │   ├── api/                       # NestJS backend application
│   │   │   ├── src/                   # Source code
│   │   │   ├── test/                  # Test files
│   │   │   ├── .env.example           # Environment template
│   │   │   ├── Dockerfile             # Container configuration
│   │   │   └── package.json           # Dependencies
│   │   └── web/                       # Angular frontend application
│   │       ├── src/                   # Source code
│   │       ├── public/                # Static assets
│   │       ├── .env.example           # Environment template
│   │       ├── Dockerfile             # Container configuration
│   │       └── package.json           # Dependencies
│   ├── libs/                           # Shared libraries
│   │   ├── database/                  # TypeORM entities
│   │   ├── interfaces/                # TypeScript interfaces
│   │   ├── mailer/                    # Email service
│   │   └── shared/                    # Common utilities
│   ├── tools/                          # Build and deployment tools
│   ├── docker-compose.yml             # Development services
│   ├── nx.json                        # Nx configuration
│   ├── package.json                   # Monorepo dependencies
│   └── .gitignore                     # Git ignore rules
├── nestjs-paginate-boon/              # Standalone pagination library
│   ├── src/                           # Library source code
│   ├── lib/                           # Compiled output
│   ├── test/                          # Test files
│   ├── package.json                   # Library dependencies
│   └── README.md                      # Library documentation
├── boon-ansible-provisioning/         # Infrastructure automation
│   ├── playbooks/                     # Ansible playbooks
│   ├── roles/                         # Ansible roles
│   ├── inventory/                     # Server inventory
│   └── README.md                      # Infrastructure docs
├── Documents/                         # Project documentation
│   ├── Project-Overview.md            # High-level overview
│   ├── Backend-Architecture.md        # Backend detailed docs
│   ├── Frontend-Architecture.md       # Frontend detailed docs
│   ├── Database-Schema.md             # Database documentation
│   ├── API-Documentation.md           # API reference
│   ├── Development-Guide.md           # Development processes
│   └── Pagination-Library.md          # Pagination library docs
├── .gitignore                         # Root git ignore
├── CLAUDE.md                          # AI assistant guidelines
└── README.md                          # This file
```

## 🔧 Key Libraries & Technologies

### Frontend Stack

- **@angular/core 16.2.12** - Modern Angular framework
- **@rx-angular/state 16.0.0** - Advanced state management
- **primeng 16.0.2** - UI component library
- **primeflex 3.3.1** - CSS utility framework
- **chart.js 4.3.0** - Data visualization
- **quill 1.3.7** - Rich text editor

### Backend Stack

- **@nestjs/core 10.1.1** - Progressive Node.js framework
- **@nestjs/typeorm 10.0.0** - TypeORM integration
- **@nestjs/jwt 10.1.0** - JWT authentication
- **@nestjs/passport 10.0.0** - Passport authentication
- **@nestjs/swagger 7.1.2** - OpenAPI documentation
- **typeorm 0.3.17** - Object-relational mapping
- **mysql 2.18.1** - MySQL database driver

### Development Tools

- **nx 16.10.0** - Monorepo development tools
- **jest 29.6.1** - JavaScript testing framework
- **cypress 13.0.0** - End-to-end testing
- **eslint 8.46.0** - Code linting
- **prettier 2.6.2** - Code formatting
- **husky 8.0.3** - Git hooks
- **typescript 5.1.6** - TypeScript compiler

### Infrastructure & DevOps

- **docker** - Containerization
- **ansible** - Configuration management
- **seq** - Structured logging
- **mailhog** - Email testing
- **mysql 8.0** - Database
- **nginx** - Reverse proxy (production)

## 🔍 Troubleshooting

### Common Issues

#### Port Conflicts

If you encounter port conflicts during development:

```bash
# Check what's using ports
netstat -tulpn | grep :4200    # Angular dev server
netstat -tulpn | grep :3333    # NestJS API
netstat -tulpn | grep :3306    # MySQL
netstat -tulpn | grep :5341    # Seq
netstat -tulpn | grep :8025    # MailHog

# Kill processes using ports (macOS/Linux)
sudo lsof -ti:4200 | xargs kill -9

# Or change ports in configuration files
```

#### Database Connection Issues

```bash
# Check MySQL status
brew services list | grep mysql    # macOS
sudo systemctl status mysql        # Linux

# Restart MySQL
brew services restart mysql        # macOS
sudo systemctl restart mysql       # Linux

# Test connection
mysql -u boon_user -p -h localhost boon_dev

# Reset database (development only)
cd boon
nx schema:drop
nx migration:run
```

#### Node.js Version Issues

```bash
# Check current Node.js version
node --version

# Install correct version using nvm
nvm install 18
nvm use 18

# Set as default
nvm alias default 18
```

#### Nx Commands Not Working

```bash
# Clear Nx cache
rm -rf .nx/cache

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Verify Nx installation
npx nx --version
```

#### Docker Issues

```bash
# Check Docker status
docker --version
docker-compose --version

# Reset Docker (macOS)
# Docker Desktop → Preferences → Reset → Reset to factory defaults

# Clean up Docker resources
docker system prune -a
```

### Performance Issues

#### Slow Build Times

```bash
# Use Nx affected commands
nx affected:build
nx affected:test

# Enable incremental builds
nx build api --verbose

# Clear cache and rebuild
nx reset
nx build
```

#### Memory Issues

```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=8192"

# Or add to package.json scripts
"scripts": {
  "serve:api": "node --max-old-space-size=8192 ./node_modules/.bin/nx serve api"
}
```

### Getting Help

1. **Check the logs** in Seq at http://localhost:5341
2. **Review environment configuration** in `.env` files
3. **Consult the detailed documentation** in the `Documents/` folder
4. **Check GitHub issues** for known problems
5. **Enable debug mode** by setting `NODE_ENV=development`

## 🤝 Contributing

We welcome contributions to the Boon Fashion Management System!

### Development Standards

- **Code Style:** Follow ESLint and Prettier configurations
- **Commit Messages:** Use conventional commit format
- **Testing:** Maintain >80% test coverage
- **Documentation:** Update relevant documentation

### Contributing Workflow

1. **Fork** the repository
2. **Create a feature branch:** `git checkout -b feature/amazing-feature`
3. **Make changes** following our coding standards
4. **Add tests** for new functionality
5. **Update documentation** as needed
6. **Run tests:** `nx test`
7. **Build project:** `nx build`
8. **Commit changes:** `git commit -m "feat: add amazing feature"`
9. **Push to branch:** `git push origin feature/amazing-feature`
10. **Open a Pull Request**

### Code Review Process

All contributions require code review. We check for:

- ✅ Functionality and bug fixes
- ✅ Test coverage and quality
- ✅ Documentation updates
- ✅ Performance implications
- ✅ Security considerations
- ✅ Breaking changes and version compatibility

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

For support and questions:

- **Documentation:** Check the `Documents/` folder for detailed guides
- **API Reference:** http://localhost:3333/api (when running)
- **Issues:** Create an issue on GitHub
- **Email:** Contact the development team

**Built with ❤️ for the fashion industry**