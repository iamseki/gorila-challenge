import { HttpResponse } from '../protocols/controller';

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error,
});
