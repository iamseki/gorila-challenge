import { CalculateCDBParams, ComputedCDB } from '@/domain/calculate-unit-cdb';
import { MemoizationCacheRepository } from './computed-cdb-repository';

const makeOutputComputedCDB = (): ComputedCDB[] => [
  { date: new Date('2016-11-14'), unitPrice: 1000.53397 },
  { date: new Date('2016-11-16'), unitPrice: 1001.06822 },
  { date: new Date('2016-11-17'), unitPrice: 1001.60276 },
  { date: new Date('2016-11-18'), unitPrice: 1002.13758 },
];

const makeInputCDBParams = (): CalculateCDBParams => ({
  cdbRate: 103.5,
  investmentDate: new Date('2016-11-14'),
  currentDate: new Date('2016-11-21'),
});

const makeSut = () => {
  const sut = new MemoizationCacheRepository();
  const input = makeInputCDBParams();
  const result = makeOutputComputedCDB();
  return {
    sut,
    input,
    result,
  };
};

describe('ComputedCDB Memoization Repository', () => {
  it('Should be possible to set a key value pair in cache properly', async () => {
    const { sut, input, result } = makeSut();
    await sut.set(input, result);
    const cachedResult = await sut.get(input);
    expect(cachedResult).toEqual(result);
  });

  it('Should returns an empty ComputedCDB array if cache doesnt has the input key', async () => {
    const { sut, input } = makeSut();
    const cachedResult = await sut.get(input);
    expect(cachedResult).toEqual([]);
  });
});
