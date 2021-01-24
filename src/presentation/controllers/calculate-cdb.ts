import { CalculateUnitCDB } from '../../domain/calculate-unit-cdb';
import { MissingParamError } from '../errors/missing-param-error';
import { badRequest } from '../helpers/http-helper';
import { Controller, HttpRequest, HttpResponse } from '../protocols/controller';

export class CalculateCDBController implements Controller {
  constructor(private readonly calculateUnitCDB: CalculateUnitCDB) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    return badRequest(new MissingParamError('cdbRate'));
  }
}
