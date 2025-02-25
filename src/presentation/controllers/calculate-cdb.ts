import { CalculateUnitCDB } from '@/domain/calculate-unit-cdb';
import { InvalidParamError } from '../errors/invalid-param-error';
import { MissingParamError } from '../errors/missing-param-error';
import { badRequest, serverError, success } from '../helpers/http-helper';
import { Controller, HttpRequest, HttpResponse } from '../protocols/controller';
import { DateValidator } from '../protocols/date-validator';

export class CalculateCDBController implements Controller {
  constructor(
    private readonly calculateUnitCDB: CalculateUnitCDB,
    private readonly dateValidator: DateValidator
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
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

      let { cdbRate, investmentDate, currentDate } = httpRequest.body;
      investmentDate = new Date(investmentDate);
      currentDate = new Date(currentDate);

      if (currentDate <= investmentDate || investmentDate >= currentDate) {
        return badRequest(new InvalidParamError('invalid input dates'));
      }

      const computedCDB = await this.calculateUnitCDB.compute({
        cdbRate,
        investmentDate,
        currentDate,
      });

      const formatedResult = computedCDB.map(({ date, unitPrice }) => {
        const day = date.getUTCDate();
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth() + 1;
        const formatedStringDate = `${year}-${month}-${day}`;
        return {
          date: formatedStringDate,
          unitPrice,
        };
      });
      return success(formatedResult);
    } catch (err) {
      return serverError(err);
    }
  }
}
