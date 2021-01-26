import { Express, json, Request, Response, NextFunction } from 'express';

export default (app: Express): void => {
  app.use(cors);
  app.use(json());
};

const cors = (req: Request, res: Response, next: NextFunction): void => {
  res.set('access-control-allow-origin', '*');
  res.set('access-control-allow-methods', '*');
  res.set('access-control-allow-headers', '*');
  next();
};
