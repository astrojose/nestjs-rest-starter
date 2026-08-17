---
name: controller-swagger-linter
description: 'Strict instructions for checking and autofixing NestJS Controller and DTO Swagger OpenAPI annotations. Use whenever adding or updating endpoints, controllers, or DTOs.'
---

# Controller Swagger Linter

## Overview
Rulebook for OpenAPI / Swagger annotations across all NestJS controllers and DTOs in `nestjs-rest-starter`.

## Validation Rules

### 1. Controller Decorators
- Every controller class must be decorated with `@ApiTags('<feature-name>')` and `@Auth()` (or `@ApiBearerAuth('JWT')`).
- Use `@Public()` for unauthenticated endpoints.

### 2. Method Decorators
- Every endpoint method must have `@ApiOperation({ summary: '...' })`.
- Use standard composite response decorators from `src/common/decorators`:
  - `@ApiCreatedStandardResponse('ResourceName', ResponseDto)` for POST (201).
  - `@ApiStandardResponse(ResponseDto)` for GET (200).
  - `@ApiPaginatedResponse(ResponseDto)` and `@ApiPaginationQueries()` for paginated list endpoints.
  - `@ApiUpdatedResponse('ResourceName', ResponseDto)` for PATCH/PUT (200).
  - `@ApiDeletedResponse('ResourceName')` for DELETE (200).
  - `@ApiNotFoundStandardResponse('ResourceName')` for endpoints with ID path params.

### 3. DTO Properties
- Every property in request DTOs (`CreateDto`, `UpdateDto`, `QueryDto`) and response DTOs MUST be decorated with `@ApiProperty()` or `@ApiPropertyOptional()`.
- Provide `description` and `example` values for clarity in Swagger UI.

```ts
export class CreateProductDto {
  @ApiProperty({ description: 'Product name', example: 'Wireless Mouse' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Product price in USD', example: 29.99 })
  @IsNumber()
  price: number;
}
```
