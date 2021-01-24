import {
  CalculateCDBParams,
  CalculateUnitCDB,
  ComputedCDB,
} from '../../domain/calculate-unit-cdb';
import { InvalidParamError } from '../errors/invalid-param-error';
import { MissingParamError } from '../errors/missing-param-error';
import { ServerError } from '../errors/server-error';
import { badRequest, serverError } from '../helpers/http-helper';
import { HttpRequest } from '../protocols/controller';
import { DateValidator } from '../protocols/date-validator';
import { CalculateCDBController } from './calculate-cdb';

const makeCalculateUnitCDB = (): CalculateUnitCDB => {
  class CalculateUnitCDBStub implements CalculateUnitCDB {
    async compute(params: CalculateCDBParams): Promise<ComputedCDB[]> {
      const computedCDB: ComputedCDB[] = [];
      return computedCDB;
    }
  }
  return new CalculateUnitCDBStub();
};

const makeDateValidator = (): DateValidator => {
  class DateValidatorStub implements DateValidator {
    isValid(date: string): boolean {
      return true;
    }
  }
  return new DateValidatorStub();
};

const makeFakeRequest = (): HttpRequest => ({
  body: {
    currentDate: new Date('2016-12-26'),
    cdbRate: 103.5,
    investmentDate: new Date('2016-12-26'),
  },
});

const makeSut = () => {
  const calculateUnitCDBStub = makeCalculateUnitCDB();
  const dateValidatorStub = makeDateValidator();
  const sut = new CalculateCDBController(
    calculateUnitCDBStub,
    dateValidatorStub
  );
  return {
    calculateUnitCDBStub,
    sut,
    dateValidatorStub,
  };
};

describe('CalculateCDB Controller', () => {
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

  it('Should return 400 if invalid date is provided', async () => {
    const { sut, dateValidatorStub } = makeSut();
    jest.spyOn(dateValidatorStub, 'isValid').mockReturnValueOnce(false);
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('date')));
  });

  it('Should call DateValidator with correct dates', async () => {
    const { dateValidatorStub, sut } = makeSut();
    const isValidSpy = jest.spyOn(dateValidatorStub, 'isValid');
    const httpRequest = makeFakeRequest();

    await sut.handle(httpRequest);

    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.currentDate);
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.investmentDate);
  });

  it('Should return 500 if DateValidator throws', async () => {
    const { sut, dateValidatorStub } = makeSut();
    const error = new Error();

    jest.spyOn(dateValidatorStub, 'isValid').mockImplementation(() => {
      throw error;
    });
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new ServerError(error.stack)));
  });

  it('Should call calculateUnitCDB with correct values', async () => {
    const { sut, calculateUnitCDBStub } = makeSut();

    const calculateSpy = jest.spyOn(calculateUnitCDBStub, 'compute');
    const httpRequest = makeFakeRequest();

    await sut.handle(httpRequest);
    expect(calculateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it('Should return 500 if calculateUnitCDB throws', async () => {
    const { sut, calculateUnitCDBStub } = makeSut();

    const error = new Error();
    jest
      .spyOn(calculateUnitCDBStub, 'compute')
      .mockImplementationOnce(async () => {
        return new Promise((resolve, reject) => reject(error));
      });
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(
      serverError(new ServerError(error.stack as string))
    );
  });
});
