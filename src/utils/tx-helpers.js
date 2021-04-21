// import { BigNumber } from "@ethersproject/bignumber";
import { parseUnits, formatUnits } from "@ethersproject/units";
// Hex helpers
export function joinHexData(hexData) {
  return `0x${hexData
    .map((hex) => {
      const stripped = hex.replace(/^0x/, "");
      return stripped.length % 2 === 0 ? stripped : "0" + stripped;
    })
    .join("")}`;
}

export function getHexDataLength(hexData) {
  return Math.ceil(
    (hexData.startsWith("0x") ? hexData.length - 2 : hexData.length) / 2
  );
}

export function toHex(v) {
  return `0x${Number(v.toString()).toString(16)}`;
}

// Transaction helpers
export const defaultTxOperation = 0;
export const defaultTxValue = 0;
export const defaultTxData = "0x";

export function standardizeTransaction(tx) {
  return {
    operation: tx.operation ? tx.operation : defaultTxOperation,
    to: tx.to,
    value: tx.value ? tx.value.toString() : defaultTxValue,
    data: tx.data ? tx.data : defaultTxData,
  };
}

export const getAmountInWei = (tokenAmount, decimals) => {
  // return BigNumber.from(tokenAmount).mul(
  //   BigNumber.from(String(10 ** decimals))
  // );
  return parseUnits(tokenAmount, decimals);
};

export const getAmountFromWei = (tokenAmount, decimals, precision = 2) => {
  return parseFloat(formatUnits(tokenAmount, decimals)).toFixed(precision);
};
