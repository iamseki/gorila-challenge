import { Controller, HttpRequest } from '@/presentation/protocols/controller';
import { Request, Response } from 'express';

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body,
    };
    const httpResponse = await controller.handle(httpRequest);
    if (httpResponse.statusCode === 200) {
      return res.status(httpResponse.statusCode).json(httpResponse.body);
    }
    return res
      .status(httpResponse.statusCode)
      .json({ error: httpResponse.body.message });
  };
};
