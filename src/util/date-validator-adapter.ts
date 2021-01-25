import { DateValidator } from '@/presentation/protocols/date-validator';
import validator from 'validator';
export class DateValidatorAdapter implements DateValidator {
  isValid(date: string): boolean {
    return validator.isDate(date, {
      format: 'YYYY-MM-DD',
      delimiters: ['-', '/'],
    });
  }
}
