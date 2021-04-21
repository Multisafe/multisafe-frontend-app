export function formatNumber(x, decimals = 2) {
  return parseFloat(x)
    .toFixed(decimals)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
