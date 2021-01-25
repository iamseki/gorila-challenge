export interface CDIRepository {
  findByDate: (date: string) => Promise<number>;
}
