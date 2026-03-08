# NestJS Starter Improvement Report

## Reference Review Summary

### Worth Adopting
- Standardized global validation pipe with nested field error formatting.
- Standardized global exception filter for predictable HTTP error shape.
- Global bootstrap cross-cutting registration (guard, interceptor, validation).
- Repository abstraction to keep services free of direct ORM manager usage.
- Reusable auth decorators/guards (`Public`, role/permission metadata).

### Do Not Copy Directly
- Microservice bootstrap concerns (RabbitMQ microservice startup, audit bus wiring).
- Cross-service Redis permission fetch for this starter baseline.
- Heavy audit interceptors tied to domain route mappings.

### Starter Gaps Found
- No global validation pipe/filter configured.
- Interceptors existed but were not globally wired.
- Data access used `EntityManager` directly in services/seeder.
- Auth strategy wiring had correctness issues and weak config coupling.
- TypeScript strictness and lint standards were partially enabled only.

## Implemented Improvements (Current Diff)
- Added global pipe/filter:
  - `src/common/pipes/global-validation.pipe.ts`
  - `src/common/filters/http-exception.filter.ts`
- Wired global providers:
  - `APP_PIPE`, `APP_FILTER`, `APP_INTERCEPTOR` in `src/app.module.ts`
- Improved app bootstrap:
  - URI versioning, config-driven prefix/port, guarded seeding in `src/main.ts`
- Enforced repository pattern for domain access:
  - `src/common/repositories/base.repository.ts`
  - `src/modules/users/repositories/user.repository.ts`
  - `src/modules/roles/repositories/role.repository.ts`
  - `src/modules/roles/repositories/permission.repository.ts`
- Refactored services/seeder to repository usage:
  - `users.service.ts`, `roles.service.ts`, `seeder.service.ts`
- Added lightweight enterprise auth guards/decorators:
  - `roles.decorator.ts`, `permissions.decorator.ts`
  - `roles.guard.ts`, `permissions.guard.ts`
- Fixed auth strategy/config patterns:
  - `jwt.strategy.ts`, `local.strategy.ts`, `auth.module.ts`, `auth.service.ts`
- Tightened TypeScript/ESLint baseline:
  - `tsconfig.json`, `.eslintrc.js`

## Prioritized Backlog

### P0
- Add integration/e2e tests for auth + role/permission guard paths.
- Add migration strategy for schema-safe role/user evolution (disable `synchronize` outside local dev).
- Remove remaining lint warnings by adding explicit return types and eliminating residual `any`.

### P1
- Introduce repository interfaces (ports) for clearer test seams.
- Add pagination/query utilities in common layer for consistent list endpoints.
- Add API error/response contract tests for interceptors and filters.

### P2
- Add module-level domain policies (authorization policy service abstraction).
- Add request-scoped correlation id + structured logging context.
- Add optional caching interceptor pattern for read-heavy endpoints.

## Phased Execution Plan

1. Foundation (done)
- Global bootstrap standards and repository baseline.

2. Quality Gate
- Add e2e coverage for auth, role, and permission-protected routes.
- Enforce warning-free lint and CI gates (`lint`, `build`, `test:e2e`).

3. Domain Hardening
- Introduce repository interfaces and query/pagination toolkit.
- Add policy service for permission evaluation.

4. Operational Hardening
- Add observability context and optional cache patterns.

## Actionable Checklist
- [x] Add and wire global validation pipe.
- [x] Add and wire global HTTP exception filter.
- [x] Wire global logging/response interceptors through DI providers.
- [x] Implement mandatory repository layer for user/role/permission data access.
- [x] Refactor service + seeder data access to repositories.
- [x] Add simple role/permission decorators + guards.
- [x] Fix auth strategy configuration and user hydration.
- [x] Enable stricter TS compiler settings.
- [ ] Remove remaining ESLint warnings.
- [ ] Add e2e tests for auth/repository/guard paths.
