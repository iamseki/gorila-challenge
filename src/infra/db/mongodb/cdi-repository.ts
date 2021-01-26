import { CDI, CDIRepository } from '@/app/protocols/cdi-repository';
import { MongoHelper } from './mongo-helper';

export class CDIMongoRepository implements CDIRepository {
  async findBetweenDate(start: Date, end: Date): Promise<CDI[]> {
    const cdiCollection = await MongoHelper.getCollection<CDI>('cdi');
    const cdis = await cdiCollection
      .find(
        {
          date: {
            $gte: start,
            $lte: end,
          },
        },
        { sort: { date: 1 } }
      )
      .toArray();

    return cdis;
  }
}
