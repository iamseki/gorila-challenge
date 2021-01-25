import {
  CalculateCDBParams,
  CalculateUnitCDB,
  ComputedCDB,
} from '../../domain/calculate-unit-cdb';
import { ComputedCDBCacheRepository } from '../protocols/computed-cache-repository';
import { CDIRepository } from '../protocols/cdi-repository';

export class DBCalculateUnitCDB implements CalculateUnitCDB {
  constructor(
    private readonly cdiRepository: CDIRepository,
    private readonly computedCacheRepository: ComputedCDBCacheRepository
  ) {}

  async compute(params: CalculateCDBParams): Promise<ComputedCDB[]> {
    await this.computedCacheRepository.get(params);
    return [];
  }
}
