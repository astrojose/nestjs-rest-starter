# NestJS REST Starter

A production-ready NestJS REST API starter with modern architecture, batteries included, and clean developer tooling.

## Features

- **Auth & RBAC** — Composite `@Auth()` decorator combining JWT guard, permissions guard, and Swagger authorization; `@AuthUser()` parameter decorator; password reset & change flows.
- **Redis Caching & Token Revocation** — High-performance Redis caching for role permissions (`role:<roleName>` set membership in `PermissionsGuard`), token blacklisting (`blacklist:<token>` in `JwtStrategy`), and logout endpoint (`POST /auth/logout`) with automatic fallback to database/in-memory if Redis is disabled.
- **Unified Response Envelope** — Standardized JSON structure (`status`, `message`, `timestamp`, `path`, `data`, `pagination`, `meta`) with automatic message promotion.
- **Pagination Utility** — `Pagination.paginate()` helper and `PaginationQueryDto` with validation, search query (`q`), sorting (`sortBy`, `sortOrder`), and page size controls.
- **Global Exception Handling** — `HttpExceptionFilter` handling Nest exceptions, validation errors, and TypeORM database errors (e.g. unique constraint violations, foreign key issues).
- **Custom OpenAPI Swagger Decorators** — `@ApiPaginatedResponse()`, `@ApiStandardResponse()`, `@ApiCreatedStandardResponse()`, `@ApiCrudResponses()`, `@ApiPaginationQueries()`. Auto-generated UI at `/api/docs` (non-production).
- **Base Entities & Repositories** — `BasicEntity` (increment ID) and `UuidBasicEntity` with soft-delete (`deletedAt`) and auditor fields (`createdBy`, `updatedBy`); `BaseRepository` with `findPaginated()`, soft-delete, and transaction helpers.
- **Health Checks** — Standard `/health` endpoint returning system uptime, status, and timestamp for Docker/K8s liveness & readiness probes.
- **Scaffolding Schematics** — Built-in `make new-module name=<name>` CLI command that generates a fully structured, paginated, and authenticated domain module.
- **Seeder** — Seeds default Admin & Manager roles and users on startup, automatically syncing permission sets to Redis.
- **Docker & CI/CD** — Multi-stage `Dockerfile`, `compose.yaml` with Postgres & Redis services, and GitHub Actions CI workflow.

## Getting started

### Option A — Interactive project setup (Recommended)

```bash
pnpm install
make init        # Interactive script: sets project name, description, .env, and optional git reset
make docker-up   # Start Postgres & Redis in Docker
make dev         # Start dev server with hot reload
```

### Option B — Manual setup

```bash
cp .env.example .env   # Fill in your database & secret values
pnpm install
make docker-up
pnpm run start:dev
```

- **Swagger UI**: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
- **Health Check**: [http://localhost:3000/api/v1/health](http://localhost:3000/api/v1/health)

## Common commands

| Command | Description |
|---|---|
| `make dev` | Start dev server with hot reload |
| `make build` | Build for production |
| `make test` | Run unit tests |
| `make test-cov` | Run unit tests with coverage |
| `make lint` | Lint and auto-fix source files |
| `make format` | Format source files with Prettier |
| `make docker-up` | Start Docker containers (Postgres & Redis) |
| `make docker-down` | Stop Docker containers |
| `make new-module name=<name>` | Scaffold a complete domain module |

Run `make help` for the full list of available targets.

## Scaffolding a new module

```bash
make new-module name=product
# or directly:
nest g resource product --collection ./schematics
```

Generates a fully structured module under `src/modules/product/` with:
- Entity extending `BasicEntity` with soft-delete support
- `CreateProductDto` / `UpdateProductDto` with `class-validator`
- `ProductResponseDto` with constructor pattern
- Repository extending `BaseRepository`
- Service with CRUD and `findPaginated()` operations
- Controller decorated with `@Auth()`, `@ApiPaginatedResponse()`, and `@ApiCrudResponses()`
- Module registered with TypeORM

Then register it in `src/app.module.ts`:

```typescript
import { ProductModule } from './modules/product/product.module';

@Module({
  imports: [..., ProductModule],
})
export class AppModule {}
```

## Default seed credentials

| Role    | Email                  | Password       |
|---------|------------------------|----------------|
| Admin   | admin@example.com      | Admin@1234!    |
| Manager | manager@example.com    | Manager@1234!  |

> Update these in `src/modules/seeder/seeder.service.ts` or via environment variables before deploying to production.

## Environment variables

See `.env.example` for all configurable properties.

| Variable          | Description                          | Default       |
|-------------------|--------------------------------------|---------------|
| `NODE_ENV`        | Environment (`development`/`production`) | `development` |
| `PORT`            | HTTP port                            | `3000`        |
| `APP_NAME`        | App name shown in Swagger            | `API`         |
| `APP_DESCRIPTION` | App description                      | `API Description` |
| `JWT_SECRET`      | Secret for access tokens             | —             |
| `JWT_RESET_SECRET`| Secret for password reset tokens     | falls back to `JWT_SECRET` |
| `API_PREFIX`      | Global route prefix                  | `api`         |
| `CORS_ORIGIN`     | Allowed CORS origin                  | `*`           |
| `DB_TYPE`         | Database engine                      | `postgres`    |
| `DB_HOST`         | Database host                        | `localhost`   |
| `DB_PORT`         | Database port                        | `5432`        |
| `DB_USERNAME`     | Database username                    | `postgres`    |
| `DB_PASSWORD`     | Database password                    | `postgres`    |
| `DB_DATABASE`     | Database name                        | `db`          |
| `DB_SYNC`         | Auto-sync schema (dev only)          | `false`       |
| `DB_LOGGING`      | Log SQL queries                      | `false`       |
| `REDIS_ENABLED`   | Enable Redis permission cache & token revocation | `true` |
| `REDIS_HOST`      | Redis host                           | `localhost`   |
| `REDIS_PORT`      | Redis port                           | `6379`        |
| `REDIS_PASSWORD`  | Redis password (optional)            | —             |

## License

MIT
