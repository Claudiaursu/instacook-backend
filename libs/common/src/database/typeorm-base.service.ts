import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { DeepPartial, DeleteResult, FindOptions, FindManyOptions, FindOneOptions, ObjectLiteral, RemoveOptions, Repository, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class TypeOrmBaseService<T extends ObjectLiteral> {
  protected repo!: Repository<T>;

  async find(optionsOrConditions?: FindManyOptions<T>): Promise<T[]> {
    return this.repo.find(optionsOrConditions);
  }

  async findAndCount(optionsOrConditions?: FindManyOptions<T>): Promise<[T[], number]> {
    return this.repo.findAndCount(optionsOrConditions);
  }

  async findByIds(ids: string[] | number[] | Date[], optionsOrConditions?: FindManyOptions<T>): Promise<T[]> {
    return this.repo.findByIds(ids);
  }

  async findOne(optionsOrConditions?: FindOneOptions<T>): Promise<T | undefined> {
    return this.repo.findOne(optionsOrConditions);
  }

  async findOneByID(id?: string | number | Date, optionsOrConditions?: FindOneOptions<T>): Promise<T | undefined> {
    return this.repo.findOne(optionsOrConditions);
  }

  async count(optionsOrConditions?: FindManyOptions<T>): Promise<number> {
    return this.repo.count(optionsOrConditions);
  }

  async create(): Promise<T> {
    return this.repo.create();
  }

  async createOne(entityLike: DeepPartial<T>): Promise<T> {
    return this.repo.create(entityLike);
  }

  async createMany(entityLikeArray: DeepPartial<T>[]): Promise<T[]> {
    return this.repo.create(entityLikeArray);
  }

  async delete(criteria: string | number | Date | string[] | number[] | Date[]): Promise<DeleteResult> {
    return this.repo.delete(criteria);
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<T>> {
    const baseOptions: IPaginationOptions = {
      limit: 25,
      page: 0,
    };
    return paginate<T>(this.repo, { ...baseOptions, ...options });
  }

  async removeOne(entity: T, options?: RemoveOptions): Promise<T> {
    return this.repo.remove(entity, options);
  }

  async removeMany(entities: T[], options?: RemoveOptions): Promise<T[]> {
    return this.repo.remove(entities, options);
  }

  async update(criteria: string | number | Date | string[] | number[] | Date[], partialEntity: QueryDeepPartialEntity<T>): Promise<UpdateResult> {
    return this.repo.update(criteria, partialEntity);
  }
}
