export const isNull = <T>(variable: T | null): variable is null =>
  variable === null;
