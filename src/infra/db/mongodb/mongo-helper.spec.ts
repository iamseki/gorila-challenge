import { MongoHelper as sut } from './mongo-helper';

describe('MongoHelper', () => {
  beforeAll(async () => {
    await sut.connect(
      process.env.MONGO_URL ?? 'mongodb://localhost:27017/gorila-challenge'
    );
  });

  afterAll(async () => {
    await sut.disconnect();
  });

  test('Should reconnect if mongodb is down', async () => {
    let accountCollection = await sut.getCollection('cdi');
    expect(accountCollection).toBeTruthy();
    expect(sut.client.isConnected()).toBeTruthy();

    await sut.disconnect();
    accountCollection = await sut.getCollection('cdi');
    expect(accountCollection).toBeTruthy();
    expect(sut.client.isConnected()).toBeTruthy();
  });
});
