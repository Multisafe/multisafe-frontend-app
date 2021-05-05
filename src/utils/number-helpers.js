import Big from "big.js";

export function formatNumber(x, decimals = 2) {
  return Big(x)
    .round(decimals)
    .toString()
    .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}
