import { CalculateUnitCDB } from '../../domain/calculate-unit-cdb';
import { InvalidParamError } from '../errors/invalid-param-error';
import { MissingParamError } from '../errors/missing-param-error';
import { badRequest } from '../helpers/http-helper';
import { Controller, HttpRequest, HttpResponse } from '../protocols/controller';
import { DateValidator } from '../protocols/date-validator';

export class CalculateCDBController implements Controller {
  constructor(
    private readonly calculateUnitCDB: CalculateUnitCDB,
    private readonly dateValidator: DateValidator
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['cdbRate', 'investmentDate', 'currentDate'];
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }
    const dateFields = ['investmentDate', 'currentDate'];
    for (const field of dateFields) {
      const date = httpRequest.body[field];
      if (!this.dateValidator.isValid(date)) {
        return badRequest(new InvalidParamError('date'));
      }
    }
    return { body: 500, statusCode: 500 };
  }
}
