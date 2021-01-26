import { ComputedCDBCacheRepository } from '@/app/protocols/computed-cache-repository';
import { CalculateCDBParams, ComputedCDB } from '@/domain/calculate-unit-cdb';

export class MemoizationCacheRepository implements ComputedCDBCacheRepository {
  private readonly memoHashMap: Map<string, ComputedCDB[]>;
  constructor() {
    this.memoHashMap = new Map();
  }

  async get(input: CalculateCDBParams): Promise<ComputedCDB[]> {
    const hash = this.makeHash(input);
    return new Promise((resolve) => resolve(this.memoHashMap.get(hash) ?? []));
  }

  async set(input: CalculateCDBParams, result: ComputedCDB[]): Promise<void> {
    const hash = this.makeHash(input);
    this.memoHashMap.set(hash, result);
    return new Promise<void>((resolve) => resolve());
  }

  private makeHash(input: CalculateCDBParams): string {
    return `${input.investmentDate.toLocaleDateString()}${input.cdbRate.toString()}${input.currentDate.toLocaleDateString()}`;
  }
}
