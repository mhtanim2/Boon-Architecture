export const objectLiteralToMap = <T extends { get: (k: string) => any; set: (k: string, value: any) => void }>(
  map: T,
  obj: any
): T => {
  for (const [key, value] of Object.entries(obj ?? {})) {
    map.set(key, value);
  }
  return map;
};
