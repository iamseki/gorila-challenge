export interface CalculateCDBParams {
  investmentDate: Date;
  cdbRate: number;
  currentDate: Date;
}

export interface ComputedCDB {
  date: Date;
  unitPrice: number;
}

export interface CalculateUnitCDB {
  compute: (params: CalculateCDBParams) => Promise<ComputedCDB[]>;
}
