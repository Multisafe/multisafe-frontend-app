export const formatPrice = (num: number) =>
  num >= 1 ? num.toFixed(2) : num.toFixed(18).replace(/(\.\d{1,4})\d+/, "$1");
