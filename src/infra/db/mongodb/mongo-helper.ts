import { Collection, MongoClient } from 'mongodb';

class Mongo {
  public client!: MongoClient;
  public uri!: string;

  public async connect(uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    this.uri = uri;
  }

  public async disconnect(): Promise<void> {
    await this.client.close();
  }

  async getCollection<T>(name: string): Promise<Collection<T>> {
    if (!this.client.isConnected()) {
      await this.connect(this.uri);
    }
    return this.client.db().collection<T>(name);
  }
}

export const MongoHelper = new Mongo();
