import { DateValidatorAdapter } from './date-validator-adapter';
import validator from 'validator';

jest.mock('validator', () => ({
  isDate(): boolean {
    return true;
  },
}));

const makeSut = (): DateValidatorAdapter => new DateValidatorAdapter();

describe('DateValidator Adapter', () => {
  it('Should return false if validator returns false', () => {
    const sut = makeSut();
    jest.spyOn(validator, 'isDate').mockReturnValueOnce(false);
    const isValid = sut.isValid('invalid/date/');
    expect(isValid).toBe(false);
  });

  it('Should return true if validator returns true', () => {
    const sut = makeSut();
    const isValid = sut.isValid('2016-11-14');
    expect(isValid).toBeTruthy();
  });

  it('Should call validator with correct date and options', () => {
    const sut = makeSut();
    const isDateSpy = jest.spyOn(validator, 'isDate');

    const dateToTest = '2016-11-14';
    const validatorOptions = { delimiters: ['-', '/'], format: 'YYYY-MM-DD' };

    sut.isValid('2016-11-14');
    expect(isDateSpy).toHaveBeenCalledWith(dateToTest, validatorOptions);
  });
});
