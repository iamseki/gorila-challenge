import {
  CalculateCDBParams,
  ComputedCDB,
} from '../../domain/calculate-unit-cdb';
import { CDIRepository } from '../protocols/cdi-repository';
import { ComputedCDBCacheRepository } from '../protocols/computed-cache-repository';
import { DBCalculateUnitCDB } from './db-calculate-unit-cdb';

const makeCDIRepository = (): CDIRepository => {
  class CDIRepositoryStub implements CDIRepository {
    async findByDate(date: string): Promise<number> {
      return new Promise((resolve) => resolve(13.88));
    }
  }
  return new CDIRepositoryStub();
};

const makeCacheRepository = (): ComputedCDBCacheRepository => {
  class ComputedCacheRepositoryStub implements ComputedCDBCacheRepository {
    private readonly memoizationCache: Map<string, ComputedCDB[]>;
    constructor() {
      this.memoizationCache = new Map();
    }

    async get(input: CalculateCDBParams): Promise<ComputedCDB[]> {
      const computedCDB = this.memoizationCache.get('fake-hash');
      return computedCDB ?? [];
    }

    async set(input: CalculateCDBParams, result: ComputedCDB[]): Promise<void> {
      this.memoizationCache.set('fake-hash', result);
      return new Promise((resolve) => resolve());
    }
  }

  return new ComputedCacheRepositoryStub();
};

const makeInputCDBParams = (): CalculateCDBParams => ({
  currentDate: new Date('2016-12-23'),
  cdbRate: 103.5,
  investmentDate: new Date('2016-12-21'),
});

const makeSut = () => {
  const computedCacheRepositoryStub = makeCacheRepository();
  const cdiRepositoryStub = makeCDIRepository();
  const sut = new DBCalculateUnitCDB(
    cdiRepositoryStub,
    computedCacheRepositoryStub
  );
  return {
    computedCacheRepositoryStub,
    cdiRepositoryStub,
    sut,
  };
};
describe('DBCalculateUnitCDB usecase', () => {
  it('Should search in computedCacheRepository with correct values', async () => {
    const { sut, computedCacheRepositoryStub } = makeSut();
    const inputCDBParams = makeInputCDBParams();
    const cacheSpy = jest.spyOn(computedCacheRepositoryStub, 'get');
    await sut.compute(inputCDBParams);
    expect(cacheSpy).toHaveBeenCalledWith(inputCDBParams);
  });
});
