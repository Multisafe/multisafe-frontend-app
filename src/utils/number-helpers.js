import Big from "big.js";

export function formatNumber(x, decimals = 2) {
  if (!x) return "0";
  try {
    let formattedNumber = Big(x)
      .round(decimals)
      .toString()
      .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");

    return formattedNumber;
  } catch (err) {
    console.error(err);
    return "0";
  }
}
