import { CalculateUnitCDB } from '../../domain/calculate-unit-cdb';
import { MissingParamError } from '../errors/missing-param-error';
import { badRequest } from '../helpers/http-helper';
import { Controller, HttpRequest, HttpResponse } from '../protocols/controller';

export class CalculateCDBController implements Controller {
  constructor(private readonly calculateUnitCDB: CalculateUnitCDB) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['cdbRate', 'investmentDate', 'currentDate'];
    for (const field of requiredFields) {
      if (!httpRequest.body[field])
        return badRequest(new MissingParamError(field));
    }
    return { body: null, statusCode: 500 };
  }
}
