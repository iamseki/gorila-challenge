export interface CDI {
  value: number;
  date: Date;
}
export interface CDIRepository {
  findBetweenDate: (start: Date, end: Date) => Promise<CDI[]>;
}
