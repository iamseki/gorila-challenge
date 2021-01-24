import {
  CalculateCDBParams,
  CalculateUnitCDB,
  ComputedCDB,
} from '../../domain/calculate-unit-cdb';
import { MissingParamError } from '../errors/missing-param-error';
import { badRequest } from '../helpers/http-helper';
import { CalculateCDBController } from './calculate-cdb';

const makeCalculateUnitCDBStub = (): CalculateUnitCDB => {
  class CalculateUnitCDBStub implements CalculateUnitCDB {
    async compute(params: CalculateCDBParams): Promise<ComputedCDB> {
      throw new Error('Method not implemented.');
    }
  }
  return new CalculateUnitCDBStub();
};

const makeSut = () => {
  const calculator = makeCalculateUnitCDBStub();
  const sut = new CalculateCDBController(calculator);
  return {
    calculator,
    sut,
  };
};

describe('CalculateCDB', () => {
  it('Should return 400 if cdbRate is not provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        investmentDate: new Date('2016-11-14'),
        currentDate: new Date('2016-12-26'),
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('cdbRate')));
  });

  it('Should return 400 if investmentDate is not provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        cdbRate: 103.5,
        currentDate: new Date('2016-12-26'),
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(
      badRequest(new MissingParamError('investmentDate'))
    );
  });

  it('Should return 400 if currentDate is not provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        cdbRate: 103.5,
        investmentDate: new Date('2016-12-26'),
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(
      badRequest(new MissingParamError('currentDate'))
    );
  });
});
