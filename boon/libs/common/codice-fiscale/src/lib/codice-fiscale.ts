import { dayjs } from '@boon/common/dayjs';
import { findKey } from 'lodash';
import {
  CodiceFiscaleRegex,
  Gender,
  MonthsCoding,
  NormalizedCodiceFiscaleRegex,
  OmocodiaIndexes,
  OmocodiaReplacements,
} from './codice-fiscale.constants';
import { replaceAtIndex } from './string-utils';
import { calculateCheckCode } from './utils';

export type CodiceFiscaleData = {
  familyName: string;
  givenName: string;
  gender: Gender;
  dateOfBirth: Date;
  birthPlaceCode: string;
};

const _isValidCodiceFiscale = (codiceFiscale: string): boolean => {
  if (!CodiceFiscaleRegex.test(codiceFiscale)) {
    return false;
  }

  const expectedCheckCode = codiceFiscale.charAt(15);
  return calculateCheckCode(codiceFiscale) === expectedCheckCode;
};

const _isOmocodice = (codiceFiscale: string): boolean => {
  return !NormalizedCodiceFiscaleRegex.test(codiceFiscale);
};

const _normalizeCodiceFiscale = (codiceFiscale: string): string => {
  if (!_isOmocodice(codiceFiscale)) return codiceFiscale;

  let omocodiaLevel = 0;
  let normalizedWithoutCheckCode = codiceFiscale.substring(0, 15);

  for (const i of OmocodiaIndexes) {
    if (new RegExp(/^[a-zA-Z]$/).test(normalizedWithoutCheckCode[i])) {
      omocodiaLevel++;
      const replacedDigit = findKey(
        OmocodiaReplacements,
        (replacementLetter: string) => replacementLetter === normalizedWithoutCheckCode[i]
      ) as string;
      normalizedWithoutCheckCode = replaceAtIndex(normalizedWithoutCheckCode, i, replacedDigit);
    }
  }

  const checkCode = calculateCheckCode(normalizedWithoutCheckCode);
  const normalized = normalizedWithoutCheckCode + checkCode;

  return normalized;
};

const _extractDataFromCodiceFiscale = (normalizedCodiceFiscale: string): CodiceFiscaleData => {
  const getGenderAndDayOfBirth = (codifiedDayOfMonth: string): { gender: Gender; dayOfMonth: number } => {
    return +codifiedDayOfMonth > 40
      ? { gender: 'Female', dayOfMonth: +codifiedDayOfMonth - 40 }
      : { gender: 'Male', dayOfMonth: +codifiedDayOfMonth };
  };

  const getYearOfBirth = (codifiedYear: string, month: number, day: number): number => {
    const year = 1900 + +codifiedYear;

    const rawCurrentAge = dayjs().year() - year;
    const currentAge = dayjs(new Date(year, month - 1, day)).isAfter(dayjs().add(-rawCurrentAge, 'years'))
      ? rawCurrentAge - 1
      : rawCurrentAge;

    const yearOfBirth = currentAge <= 100 ? year : year + 100;

    return yearOfBirth;
  };

  const month = Number(
    findKey(MonthsCoding, (codifiedMonth: string) => codifiedMonth == normalizedCodiceFiscale.substring(8, 9))!
  );
  const { gender, dayOfMonth } = getGenderAndDayOfBirth(normalizedCodiceFiscale.substring(9, 11));
  const yearOfBirth = getYearOfBirth(normalizedCodiceFiscale.substring(6, 8), month, dayOfMonth);

  const data: CodiceFiscaleData = {
    familyName: normalizedCodiceFiscale.substring(0, 3),
    givenName: normalizedCodiceFiscale.substring(3, 6),
    gender,
    dateOfBirth: new Date(yearOfBirth, month - 1, dayOfMonth),
    birthPlaceCode: normalizedCodiceFiscale.substring(11, 15),
  };

  return data;
};

export const extractDataFromCodiceFiscale = (codiceFiscale: string): CodiceFiscaleData => {
  codiceFiscale = codiceFiscale.toUpperCase();

  if (!_isValidCodiceFiscale(codiceFiscale)) throw new Error(`Codice fiscale '${codiceFiscale}' is not valid`);

  codiceFiscale = _normalizeCodiceFiscale(codiceFiscale);

  const data = _extractDataFromCodiceFiscale(codiceFiscale);
  return data;
};

export const isValidCodiceFiscale = (codiceFiscale: string): boolean => {
  codiceFiscale = codiceFiscale.toUpperCase();

  return _isValidCodiceFiscale(codiceFiscale);
};
