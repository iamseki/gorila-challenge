import {
  CalculateCDBParams,
  ComputedCDB,
} from '../../domain/calculate-unit-cdb';
import { CDI, CDIRepository } from '../protocols/cdi-repository';
import { ComputedCDBCacheRepository } from '../protocols/computed-cache-repository';
import { DBCalculateUnitCDB } from './db-calculate-unit-cdb';

const makeMockCDI = (): CDI[] => [
  { date: new Date('2016-11-14'), value: 13.88 },
  { date: new Date('2016-11-16'), value: 13.88 },
  { date: new Date('2016-11-17'), value: 13.88 },
  { date: new Date('2016-11-18'), value: 13.88 },
  { date: new Date('2016-11-21'), value: 13.88 },
];

const makeCDIRepository = (): CDIRepository => {
  class CDIRepositoryStub implements CDIRepository {
    async findBetweenDate(start: Date, end: Date): Promise<CDI[]> {
      return new Promise((resolve) => resolve(makeMockCDI()));
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
  cdbRate: 103.5,
  investmentDate: new Date('2016-11-14'),
  currentDate: new Date('2016-11-21'),
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

  it('Should search for a CDI in CDIRepository with correct values', async () => {
    const { cdiRepositoryStub, sut } = makeSut();
    const inputCDBParams = makeInputCDBParams();
    const repositorySpy = jest.spyOn(cdiRepositoryStub, 'findBetweenDate');

    await sut.compute(inputCDBParams);

    const { currentDate, investmentDate } = inputCDBParams;
    expect(repositorySpy).toHaveBeenCalledWith(investmentDate, currentDate);
  });

  it('Should return correct computed cdb values if success', async () => {
    const { sut } = makeSut();
    const inputCDBParams = makeInputCDBParams();
    const expectedComputedCDB: ComputedCDB[] = [
      { date: new Date('2016-11-14'), unitPrice: 1000.53397 },
      { date: new Date('2016-11-16'), unitPrice: 1001.06822 },
      { date: new Date('2016-11-17'), unitPrice: 1001.60276 },
      { date: new Date('2016-11-18'), unitPrice: 1002.13758 },
    ];

    const computedCDB = await sut.compute(inputCDBParams);
    expect(computedCDB).toEqual(expectedComputedCDB);
  });

  it('Should insert into cache with correct values', async () => {
    const { sut, computedCacheRepositoryStub } = makeSut();
    const inputCDBParams = makeInputCDBParams();

    const cacheSpy = jest.spyOn(computedCacheRepositoryStub, 'set');
    const computedCDBs = await sut.compute(inputCDBParams);

    expect(cacheSpy).toHaveBeenCalledWith(inputCDBParams, computedCDBs);
  });
});
