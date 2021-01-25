import { ComputedCDBCacheRepository } from '@/app/protocols/computed-cache-repository';
import { CalculateCDBParams, ComputedCDB } from '@/domain/calculate-unit-cdb';

export class MemoizationCacheRepository implements ComputedCDBCacheRepository {
  private readonly memoHashMap: Map<CalculateCDBParams, ComputedCDB[]>;
  constructor() {
    this.memoHashMap = new Map();
  }

  async get(input: CalculateCDBParams): Promise<ComputedCDB[]> {
    return new Promise((resolve) => resolve(this.memoHashMap.get(input) ?? []));
  }

  async set(input: CalculateCDBParams, result: ComputedCDB[]): Promise<void> {
    this.memoHashMap.set(input, result);
    return new Promise<void>((resolve) => resolve());
  }
}
