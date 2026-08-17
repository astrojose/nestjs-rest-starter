---
name: coding-standards
description: 'MANDATORY: Load this skill before generating or refactoring ANY Controller, Service, Repository, Entity, or DTO in nestjs-rest-starter. Enforces architecture rules, repository patterns, DTO standards, and NestJS scaffolding rules.'
argument-hint: 'Feature name or module to scaffold (e.g. "product", "order", "organization")'
---

# Coding Standards — NestJS REST Starter

## Module Scaffold Standard

Domain modules are placed under `src/modules/<feature>/`:

```
src/modules/<feature>/
├── <feature>.controller.ts      HTTP endpoints
├── <feature>.service.ts         Domain business logic
├── <feature>.module.ts          NestJS module configuration
├── dto/
│   ├── create-<feature>.dto.ts  Request payload DTO
│   ├── update-<feature>.dto.ts  Update payload DTO
│   ├── query-<feature>.dto.ts   Paginated query DTO (extends PaginationQueryDto)
│   └── responses/
│       └── <feature>.response.dto.ts  Constructor-pattern Response DTO
├── entities/
│   └── <feature>.entity.ts      TypeORM Entity (extends BasicEntity / UuidBasicEntity)
└── repositories/
    └── <feature>.repository.ts  Custom repository (extends BaseRepository)
```

Use `make new-module name=<feature>` to scaffold this structure automatically.

## Entities

- Extend `BasicEntity` (incrementing integer ID) or `UuidBasicEntity` (UUID ID) from `src/common/entities`.
- Include `createdAt`, `updatedAt`, `deletedAt` (soft deletes), `createdBy`, `updatedBy`.

```ts
import { Column, Entity } from 'typeorm';
import { BasicEntity } from 'src/common/entities';

@Entity('products')
export class Product extends BasicEntity {
  @Column({ length: 150 })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;
}
```

## Repositories

- Extend `BaseRepository<T>` from `src/common/repositories`.
- Inject TypeORM repository with `@InjectRepository(Entity)`.

```ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from 'src/common/repositories';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductRepository extends BaseRepository<Product> {
  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,
  ) {
    super(repo);
  }
}
```

## Services

- Inject custom repository.
- Use `findPaginated()`, `softDeleteById()`, `restoreById()`, `findOne()` from `BaseRepository`.
- Throw typed exceptions (`NotFoundException`, `BadRequestException`).
- Return DTO instances or paginated results.

```ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginatedResult } from 'src/common/utils';
import { ProductRepository } from './repositories/product.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async create(dto: CreateProductDto): Promise<Product> {
    return this.productRepository.save(dto);
  }

  async findAllPaginated(query: PaginationQueryDto): Promise<PaginatedResult<Product>> {
    return this.productRepository.findPaginated(query);
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    return this.productRepository.save(product.mergeData(dto));
  }

  async remove(id: number): Promise<void> {
    const deleted = await this.productRepository.softDeleteById(id);
    if (!deleted) throw new NotFoundException('Product not found');
  }
}
```

## Controllers

- Use `@ApiTags('<feature>')`, `@Controller('<feature>')`, and `@Auth()`.
- Use composite Swagger response decorators from `src/common/decorators` (`@ApiPaginatedResponse()`, `@ApiCrudResponses()`, `@ApiCreatedStandardResponse()`, `@ApiUpdatedResponse()`, `@ApiDeletedResponse()`).
- Always map response items through DTO constructor: `new ProductResponseDto(product)`.

```ts
@ApiTags('product')
@Controller('product')
@Auth()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: 'Create product' })
  @ApiCreatedStandardResponse('Product', ProductResponseDto)
  async create(@Body() dto: CreateProductDto): Promise<ProductResponseDto> {
    return new ProductResponseDto(await this.productService.create(dto));
  }

  @Get()
  @ApiOperation({ summary: 'List products paginated' })
  @ApiPaginationQueries()
  @ApiPaginatedResponse(ProductResponseDto)
  async findAll(@Query() query: PaginationQueryDto) {
    const result = await this.productService.findAllPaginated(query);
    return {
      ...result,
      data: result.data.map(item => new ProductResponseDto(item)),
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by id' })
  @ApiStandardResponse(ProductResponseDto)
  @ApiNotFoundStandardResponse('Product')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ProductResponseDto> {
    return new ProductResponseDto(await this.productService.findOne(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update product' })
  @ApiUpdatedResponse('Product', ProductResponseDto)
  @ApiNotFoundStandardResponse('Product')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    return new ProductResponseDto(await this.productService.update(id, dto));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete product' })
  @ApiDeletedResponse('Product')
  @ApiNotFoundStandardResponse('Product')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.productService.remove(id);
  }
}
```

## DTOs

- Request DTOs: annotate with `class-validator` and `@ApiProperty()` / `@ApiPropertyOptional()`.
- Response DTOs: map entity properties in `constructor(entity: Entity)` constructor pattern.

```ts
export class ProductResponseDto {
  @ApiProperty({ example: 1 }) id: number;
  @ApiProperty({ example: 'Laptop' }) name: string;
  @ApiProperty({ example: 999.99 }) price: number;
  @ApiProperty() createdAt: Date;

  constructor(product: Product) {
    this.id = product.id;
    this.name = product.name;
    this.price = Number(product.price);
    this.createdAt = product.createdAt;
  }
}
```

## Verification Matrix

| Command | Purpose |
|---|---|
| `pnpm run build` | Verify TypeScript compilation |
| `pnpm run lint` | Verify ESLint formatting & rules |
| `pnpm run test` | Run Jest unit tests |
| `make new-module name=<name>` | Scaffold domain module schematic |
