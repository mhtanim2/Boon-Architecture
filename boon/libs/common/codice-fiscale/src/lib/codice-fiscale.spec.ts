import { extractDataFromCodiceFiscale } from '.';
import { calculateCheckCode, calculateFamilyNameCode, calculateGivenNameCode } from './utils';

describe('CodiceFiscale', () => {
  describe('familyName', () => {
    it('restituisce il corretto risultato in caso di sufficienti consonanti', () => {
      expect(calculateFamilyNameCode('Moreno')).toBe('MRN');
    });

    it('restituisce il corretto risultato in caso di insufficienti consonanti', () => {
      expect(calculateFamilyNameCode('Julea')).toBe('JLU');
    });
  });

  describe('givenName', () => {
    it('restituisce il corretto risultato in caso di sufficienti consonanti', () => {
      expect(calculateGivenNameCode('Marco')).toBe('MRC');
    });

    it('restituisce il corretto risultato in caso di insufficienti consonanti', () => {
      expect(calculateGivenNameCode('Luca')).toBe('LCU');
    });
  });

  describe('checkCode', () => {
    it('restituisce il corretto risultato', () => {
      expect(calculateCheckCode('MRNLCU00A01H501')).toBe('J');
    });
  });

  describe('extractDataFromCodiceFiscale', () => {
    it('restituisce il corretto risultato anche in caso di omocodie', () => {
      const expectedResult = {
        familyName: 'SPL',
        givenName: 'FNC',
        gender: 'Male',
        dateOfBirth: new Date(1991, 8 - 1, 24),
        birthPlaceCode: 'H501',
      };

      expect(extractDataFromCodiceFiscale('SPLFNC91M24H501Z')).toStrictEqual(expectedResult);
      expect(extractDataFromCodiceFiscale('SPLFNC91M24H50MR')).toStrictEqual(expectedResult);
      expect(extractDataFromCodiceFiscale('SPLFNC91M24H5LMC')).toStrictEqual(expectedResult);
      expect(extractDataFromCodiceFiscale('SPLFNC91M24HRLMX')).toStrictEqual(expectedResult);
      expect(extractDataFromCodiceFiscale('SPLFNC91M2QHRLMU')).toStrictEqual(expectedResult);
      expect(extractDataFromCodiceFiscale('SPLFNC91MNQHRLMF')).toStrictEqual(expectedResult);
      expect(extractDataFromCodiceFiscale('SPLFNC9MMNQHRLMQ')).toStrictEqual(expectedResult);
      expect(extractDataFromCodiceFiscale('SPLFNCVMMNQHRLMF')).toStrictEqual(expectedResult);
    });
  });
});
