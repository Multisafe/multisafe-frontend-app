import { ethers } from "ethers";
import Big from "big.js";

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

export const getAmountInWei = (amount, decimals) => {
  return ethers.utils.parseUnits(
    Big(amount).round(decimals).toString(),
    decimals
  );
};

export const getAmountFromWei = (amount, decimals, precision) => {
  if (precision) {
    return parseFloat(ethers.utils.formatUnits(amount, decimals)).toFixed(
      precision
    );
  }
  return parseFloat(ethers.utils.formatUnits(amount, decimals));
};
