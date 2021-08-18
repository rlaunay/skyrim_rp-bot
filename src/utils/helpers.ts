export const isPositiveInt = (str: string): boolean => {
  const res = (
    !Number.isNaN(str)
    && Number.isInteger(parseFloat(str))
    && (Number.parseInt(str, 10) >= 0)
  );
  return res;
};
