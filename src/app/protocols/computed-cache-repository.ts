import {
  CalculateCDBParams,
  ComputedCDB,
} from '../../domain/calculate-unit-cdb';

export interface ComputedCDBCacheRepository {
  get: (input: CalculateCDBParams) => ComputedCDB[];
  set: (input: CalculateCDBParams, result: ComputedCDB[]) => void;
}
