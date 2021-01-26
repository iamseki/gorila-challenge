import 'module-alias/register';
import { MongoHelper } from '@/infra/db/mongodb/mongo-helper';
import app from './config/app';

const MONGO_URI =
  process.env.MONGO_URL ?? 'mongodb://localhost:27017/gorila-challenge';
const SERVER_PORT = process.env.PORT ?? 8080;

MongoHelper.connect(MONGO_URI)
  .then(async () => {
    app.listen(SERVER_PORT, () =>
      console.log(`Server running at http://localhost:${SERVER_PORT}`)
    );
  })
  .catch(console.error);
