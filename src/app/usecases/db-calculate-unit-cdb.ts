import {
  CalculateCDBParams,
  CalculateUnitCDB,
  ComputedCDB,
} from '@/domain/calculate-unit-cdb';
import { ComputedCDBCacheRepository } from '../protocols/computed-cache-repository';
import { CDIRepository } from '../protocols/cdi-repository';

export class DBCalculateUnitCDB implements CalculateUnitCDB {
  constructor(
    private readonly cdiRepository: CDIRepository,
    private readonly computedCacheRepository: ComputedCDBCacheRepository
  ) {}

  async compute(params: CalculateCDBParams): Promise<ComputedCDB[]> {
    const computedCache = await this.computedCacheRepository.get(params);
    if (computedCache.length > 0) return computedCache;

    const { investmentDate, currentDate, cdbRate } = params;
    const cdis = await this.cdiRepository.findBetweenDate(
      investmentDate,
      currentDate
    );
    const cdisWithoutCurrentDate = cdis.filter(
      (cdi) => cdi.date.getTime() !== params.currentDate.getTime()
    );

    let accumulatedTCDI = 1;
    const fixedRateCalculation = cdbRate / 100;
    const fixedExpoentCalculation = 1 / 252;

    const computedCDBs: ComputedCDB[] = cdisWithoutCurrentDate.map((cdi) => {
      const { value, date } = cdi;
      let kTCDI = (value / 100 + 1) ** fixedExpoentCalculation - 1;
      kTCDI = Math.round(kTCDI * 100000000) / 100000000;
      accumulatedTCDI *= 1 + kTCDI * fixedRateCalculation;
      accumulatedTCDI = this.truncateTo16Digits(accumulatedTCDI);
      const accTCDIRounded = this.roundAccurately(accumulatedTCDI, 8);
      const unitPrice = accTCDIRounded * 1000;
      return {
        date,
        unitPrice: this.roundAccurately(unitPrice, 8),
      };
    });
    await this.computedCacheRepository.set(params, computedCDBs);

    return computedCDBs;
  }

  private roundAccurately(n: number, precision: number): number {
    return Number(Math.round(Number(n + 'e' + precision)) + 'e-' + precision);
  }

  private truncateTo16Digits(n: number): number {
    return Number(n.toFixed(16));
  }
}
