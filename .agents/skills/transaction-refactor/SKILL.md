---
name: transaction-refactor
description: 'Guidance for database transaction management in TypeORM with BaseRepository.'
---

# Transaction Refactor

When performing multi-table database mutations in `nestjs-rest-starter`, ensure atomicity using TypeORM DataSource transactions.

## Pattern

```ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ComplexDomainService {
  constructor(private readonly dataSource: DataSource) {}

  async executeComplexFlow(dto: ComplexDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Perform operation A
      const entityA = queryRunner.manager.create(EntityA, dto.a);
      await queryRunner.manager.save(entityA);

      // 2. Perform operation B
      const entityB = queryRunner.manager.create(EntityB, { ...dto.b, entityAId: entityA.id });
      await queryRunner.manager.save(entityB);

      await queryRunner.commitTransaction();
      return { entityA, entityB };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Transaction failed');
    } finally {
      await queryRunner.release();
    }
  }
}
```
