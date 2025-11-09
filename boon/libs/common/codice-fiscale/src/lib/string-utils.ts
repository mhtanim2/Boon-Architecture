export const replaceAtIndex = (str: string, index: number, replacement: string): string => {
  return str.substring(0, index) + replacement + str.substring(index + replacement.length);
};

export const extractVowels = (str: string): string => {
  return str.replace(/[^AEIOU]/gi, '');
};

export const extractConsonants = (str: string): string => {
  return str.replace(/[^BCDFGHJKLMNPQRSTVWXYZ]/gi, '');
};
