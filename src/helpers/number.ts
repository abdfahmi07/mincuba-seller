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
