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
    if (params.cdbRate === 0) return [];

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

    const computedCDBs: ComputedCDB[] = cdisWithoutCurrentDate.map(
      ({ date, value }) => {
        let kTCDI = (value / 100 + 1) ** fixedExpoentCalculation - 1;
        kTCDI = this.roundAccurately(kTCDI, 8);

        accumulatedTCDI *= 1 + kTCDI * fixedRateCalculation;
        accumulatedTCDI = this.truncateTo16Digits(accumulatedTCDI);
        const accumulatedTCDIRounded = this.roundAccurately(accumulatedTCDI, 8);

        const unitPrice = accumulatedTCDIRounded * 1000;
        const unitPriceRoundedTo8Digits = this.roundAccurately(unitPrice, 8);
        return {
          date,
          unitPrice: unitPriceRoundedTo8Digits,
        };
      }
    );
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
