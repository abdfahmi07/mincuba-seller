export const toIDNCurrency = (value: string) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(parseInt(value));
};

export const formatIDNDecimal = (num: number) => {
  return new Intl.NumberFormat("id-ID").format(num);
};

export const ONLY_DOT_NUMBER_REGEX = /^\d{1,3}(?:\.\d{3})*$/;

export const formatNumberWithDots = (value: string) => {
  const numericValue = value.replace(/\D/g, "");
  if (!numericValue) return "";

  const number = Number(numericValue);

  return new Intl.NumberFormat("id-ID").format(number);
};

export const parseFormattedNumber = (value?: string | null) => {
  if (!value) return 0;
  const withoutDots = value.replace(/\./g, "");
  const parsed = parseInt(withoutDots, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
};
