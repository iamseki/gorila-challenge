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
});
