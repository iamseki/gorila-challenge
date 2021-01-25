import { CDI } from '@/app/protocols/cdi-repository';
import { CDIMongoRepository } from './cdi-repository';
import { MongoHelper } from './mongo-helper';

const mockCDIs = async () => {
  const cdiCollection = await MongoHelper.getCollection<CDI>('cdi');
  await cdiCollection.insertMany([
    { date: new Date('2016-11-14'), value: 13.88 },
    { date: new Date('2016-11-16'), value: 13.88 },
    { date: new Date('2016-11-17'), value: 13.88 },
    { date: new Date('2016-11-18'), value: 13.88 },
    { date: new Date('2016-11-21'), value: 13.88 },
  ]);
};

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(
      process.env.MONGO_URL ?? 'mongodb://localhost:27017/gorila-challenge'
    );
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('cdi');
    await accountCollection.deleteMany({});
  });

  const makeSut = (): CDIMongoRepository => {
    return new CDIMongoRepository();
  };

  test('Should return a range of valid cdi values on success', async () => {
    await mockCDIs();
    const sut = makeSut();

    const investmentDate = new Date('2016-11-14');
    const currentDate = new Date('2016-11-21');
    const cdis = await sut.findBetweenDate(investmentDate, currentDate);
    const cdisLength = cdis.length;
    const lastCDIFound = cdis[cdisLength - 1];

    expect(cdisLength).toBeGreaterThan(0);
    expect(lastCDIFound.date).toEqual(new Date('2016-11-18'));
    expect(lastCDIFound.value).toBe(13.88);
  });
});
