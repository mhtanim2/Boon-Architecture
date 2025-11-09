import { CheckCodeOddCoding, CheckCodePariCoding, CheckCodeRestoCoding } from '../codice-fiscale.constants';
import { extractConsonants, extractVowels } from '../string-utils';

export const calculateCheckCode = (codiceFiscale: string): string => {
  codiceFiscale = codiceFiscale.toUpperCase();
  let val = 0;
  for (let i = 0; i < 15; i = i + 1) {
    const c: keyof typeof CheckCodePariCoding | keyof typeof CheckCodeOddCoding = codiceFiscale[i] as any;
    val += i % 2 !== 0 ? CheckCodePariCoding[c] : CheckCodeOddCoding[c];
  }
  const resto: keyof typeof CheckCodeRestoCoding = (val % 26) as any;
  return CheckCodeRestoCoding[resto];
};

export const calculateGivenNameCode = (givenName: string): string => {
  givenName = givenName.toUpperCase();

  const consonants = extractConsonants(givenName);

  const code =
    consonants.length >= 4
      ? consonants.charAt(0) + consonants.charAt(2) + consonants.charAt(3)
      : `${consonants}${extractVowels(givenName)}XXX`.substring(0, 3);
  return code;
};

export const calculateFamilyNameCode = (familyName: string): string => {
  familyName = familyName.toUpperCase();

  const code = `${extractConsonants(familyName)}${extractVowels(familyName)}XXX`.substring(0, 3);
  return code;
};
