import type {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsOrder,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { Pagination, PaginatedResult } from '../utils/pagination';

export abstract class BaseRepository<T extends { id: number | string }> {
  protected constructor(protected readonly repository: Repository<T>) {}

  create(entityLike?: DeepPartial<T>): T {
    return entityLike
      ? this.repository.create(entityLike)
      : this.repository.create();
  }

  async save(entity: DeepPartial<T>): Promise<T> {
    return this.repository.save(entity);
  }

  async saveMany(entities: DeepPartial<T>[]): Promise<T[]> {
    return this.repository.save(entities);
  }

  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
  }

  async findById(
    id: T['id'],
    options?: Omit<FindOneOptions<T>, 'where'>,
  ): Promise<T | null> {
    return this.repository.findOne({
      where: { id } as never,
      ...options,
    });
  }

  async findPaginated(
    queryDto: PaginationQueryDto,
    findOptions?: FindManyOptions<T>,
  ): Promise<PaginatedResult<T>> {
    const page = Math.max(1, Number(queryDto.currentPage) || 1);
    const limit = Math.max(1, Math.min(100, Number(queryDto.pageSize) || 10));
    const skip = (page - 1) * limit;

    const findAndCountOptions: FindManyOptions<T> = {
      ...findOptions,
      take: limit,
      skip,
    };

    if (queryDto.sortBy) {
      findAndCountOptions.order = {
        [queryDto.sortBy]: queryDto.sortOrder || 'DESC',
      } as FindOptionsOrder<T>;
    } else if (findOptions?.order) {
      findAndCountOptions.order = findOptions.order;
    }

    const [items, total] =
      await this.repository.findAndCount(findAndCountOptions);

    return Pagination.paginate(items, total, {
      currentPage: page,
      pageSize: limit,
    });
  }

  async count(options?: FindManyOptions<T>): Promise<number> {
    return this.repository.count(options);
  }

  async deleteById(id: T['id']): Promise<boolean> {
    const result = await this.repository.delete(id as never);
    return Boolean(result.affected);
  }

  async softDeleteById(id: T['id']): Promise<boolean> {
    const result = await this.repository.softDelete(id as never);
    return Boolean(result.affected);
  }

  async restoreById(id: T['id']): Promise<boolean> {
    const result = await this.repository.restore(id as never);
    return Boolean(result.affected);
  }

  createQueryBuilder(alias?: string): SelectQueryBuilder<T> {
    return this.repository.createQueryBuilder(alias);
  }
}
