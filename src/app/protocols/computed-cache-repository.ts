import {
  CalculateCDBParams,
  ComputedCDB,
} from '../../domain/calculate-unit-cdb';

export interface ComputedCDBCacheRepository {
  get: (input: CalculateCDBParams) => Promise<ComputedCDB[]>;
  set: (input: CalculateCDBParams, result: ComputedCDB[]) => Promise<void>;
}
