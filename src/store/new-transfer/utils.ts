import { ReactNode } from "react";
import { ethers } from "ethers";

// check if the field is correct
export const FIELD_NAMES = {
  FIRST_NAME: "FIRST_NAME",
  LAST_NAME: "LAST_NAME",
  ADDRESS: "ADDRESS",
  TOKEN_VALUE: "TOKEN_VALUE",
  TOKEN: "TOKEN",
  PAY_USD_IN_TOKEN: "PAY_USD_IN_TOKEN",
  DEPARTMENT_NAME: "DEPARTMENT_NAME",
  TOKEN_ADDRESS: "TOKEN_ADDRESS",
};

export const isValidField = (
  fieldName: string,
  value: number,
  tokens: Array<{ value: string; label: ReactNode }>,
  rest: any
) => {
  switch (fieldName) {
    case FIELD_NAMES.FIRST_NAME:
    case FIELD_NAMES.LAST_NAME: {
      if (value && typeof value !== "string") return false;
      return true;
    }

    case FIELD_NAMES.TOKEN_ADDRESS:
    case FIELD_NAMES.ADDRESS: {
      return ethers.utils.isAddress(String(value));
    }
    case FIELD_NAMES.TOKEN_VALUE: {
      if (value < 0 || isNaN(Number(value))) return false;
      return true;
    }
    case FIELD_NAMES.TOKEN: {
      if (!value || typeof value !== "string" || tokens[value] === undefined)
        return false;
      return true;
    }

    case FIELD_NAMES.PAY_USD_IN_TOKEN: {
      const { tokenName } = rest;
      if (
        tokenName === "USD" &&
        (!value || typeof value !== "string" || tokens[value] === undefined)
      )
        return false;
      return true;
    }
    case FIELD_NAMES.DEPARTMENT_NAME: {
      if (!value || typeof value !== "string") return false;
      return true;
    }
    default:
      return false;
  }
};
