export const compose = (...functions) => initialValue =>
  functions.reduceRight((acc, fn) => fn(acc), initialValue);
