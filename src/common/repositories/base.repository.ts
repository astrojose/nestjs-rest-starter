import type {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  Repository,
} from 'typeorm';

export abstract class BaseRepository<T extends { id: number }> {
  protected constructor(protected readonly repository: Repository<T>) {}

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
    id: number,
    options?: Omit<FindOneOptions<T>, 'where'>,
  ): Promise<T | null> {
    return this.repository.findOne({
      where: { id } as never,
      ...options,
    });
  }

  async deleteById(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return Boolean(result.affected);
  }
}
