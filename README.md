# NestJS REST Starter

A production-ready NestJS REST API starter with batteries included.

## Features

- **Auth** — JWT login, local strategy, password change & reset flows
- **Roles & Permissions** — role-based access control with a flexible permission system
- **Swagger** — auto-generated docs at `/api/docs` (non-production only); only endpoints decorated with `@ApiOperation` are exposed
- **Response DTOs** — all endpoint responses use typed constructor-pattern DTOs
- **Global validation** — `class-validator` pipe applied globally
- **Global exception filter** — consistent JSON error responses
- **Response interceptor** — uniform response envelope with status, timestamp, and path
- **Seeder** — seeds default Admin/Manager roles and users on startup (non-production)
- **Docker** — multi-stage Dockerfile + docker-compose with Postgres
- **JSON logging** — structured JSON logs via NestJS `ConsoleLogger`
- **Security** — Helmet, CORS with configurable origin, Swagger disabled in production

## Getting started

```bash
cp .env.example .env
# fill in your values in .env

pnpm install
pnpm start:dev
```

Swagger UI: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

## Docker

```bash
docker compose up -d --build
```

## Default seed credentials

| Role    | Email                  | Password       |
|---------|------------------------|----------------|
| Admin   | admin@example.com      | Admin@1234!    |
| Manager | manager@example.com    | Manager@1234!  |

> Change these in `src/modules/seeder/seeder.service.ts` or via your own seeding strategy before deploying.

## Environment variables

See `.env.example` for all required variables.

| Variable          | Description                          | Default       |
|-------------------|--------------------------------------|---------------|
| `NODE_ENV`        | Environment                          | `development` |
| `PORT`            | HTTP port                            | `3000`        |
| `APP_NAME`        | App name shown in Swagger            | —             |
| `APP_DESCRIPTION` | App description shown in Swagger     | —             |
| `JWT_SECRET`      | Secret for access tokens             | —             |
| `JWT_RESET_SECRET`| Secret for password reset tokens     | falls back to `JWT_SECRET` |
| `API_PREFIX`      | Global route prefix                  | `api`         |
| `CORS_ORIGIN`     | Allowed CORS origin                  | `*`           |
| `DB_TYPE`         | Database type                        | `postgres`    |
| `DB_HOST`         | Database host                        | —             |
| `DB_PORT`         | Database port                        | `5432`        |
| `DB_USERNAME`     | Database user                        | —             |
| `DB_PASSWORD`     | Database password                    | —             |
| `DB_DATABASE`     | Database name                        | —             |
| `DB_SYNC`         | Auto-sync schema (dev only)          | `false`       |
| `DB_LOGGING`      | Log SQL queries                      | `false`       |

## License

MIT
