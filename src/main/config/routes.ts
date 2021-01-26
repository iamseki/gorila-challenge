import { Express, Router } from 'express';
import { adaptRoute } from '../adapters/express-route-adapter';
import { makeCalculateCDBController } from '../factories/calculate-cdb';

export default (app: Express): void => {
  const router = Router();
  app.use('/api/v1', router);

  router.get('/hc', (_, res) => res.json({ health: 'ok' }));
  router.post('/calculate/cdb', adaptRoute(makeCalculateCDBController()));
};
