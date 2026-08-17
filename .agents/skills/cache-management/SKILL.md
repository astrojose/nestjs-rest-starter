---
name: cache-management
description: 'Redis caching, role permission set syncing, and token revocation strategy for nestjs-rest-starter. Use when caching queries, invalidating cache keys, managing token revocation, or setting up Redis logic.'
---

# Cache Management — NestJS REST Starter

## Overview

`RedisService` (from `src/database/redis/redis.service.ts`) provides high-performance Redis set caching and token blacklisting with automatic fallback if Redis is disabled (`REDIS_ENABLED=false`) or unreachable.

## Key Naming Conventions

Use lowercase, colon-separated key names: `{domain}:{entity}:{identifier}`

| Key Pattern | Purpose | TTL | Notes |
|---|---|---|---|
| `role:<roleName>` | Permission Set (`sadd`) | Persistent / Synced | Synced by `SeederService` and `RolesService` |
| `blacklist:<token>` | Revoked JWT access token | 86,400s (24h) | Checked by `JwtStrategy` |
| `cache:<entity>:<id>` | Query result cache | Configurable (e.g. 300s) | Cache-aside query pattern |

## Cache-Aside Query Pattern

```ts
async findOneCached(id: number): Promise<ProductResponseDto> {
  const cacheKey = `cache:product:${id}`;
  if (this.redisService.isAvailable) {
    const cached = await this.redisService.get(cacheKey);
    if (cached) return JSON.parse(cached);
  }

  const product = await this.productRepo.findById(id);
  if (!product) throw new NotFoundException();

  const dto = new ProductResponseDto(product);
  if (this.redisService.isAvailable) {
    await this.redisService.setex(cacheKey, 300, JSON.stringify(dto));
  }
  return dto;
}
```

## Token Revocation & Logout

Tokens are blacklisted in Redis on logout via `AuthService.logout(token)`:

```ts
await this.redisService.blacklistToken(token, 86400); // 24 hours
```

`JwtStrategy` verifies `isTokenBlacklisted(token)` on every authenticated HTTP request.
