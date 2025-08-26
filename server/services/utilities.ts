export const getPageCriteria = (query: any): { take: number, skip: number } => {
  const { page = 1, perPage = 50 } = query;
  return { take: perPage as number, skip: ((page as number) - 1) * (perPage as number) };
};
export const genFixedNumber = (number, digit = 5) => {
  const str = new String(number % (10 ** 4));
  const zeros = (digit - str.length) > 0 ? [...new Array(digit - str.length)].map(() => '0').join('') : '';
  return `${zeros}${number}`;
};