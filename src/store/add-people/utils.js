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
};

export const isValidField = (fieldName, value, tokens) => {
  switch (fieldName) {
    case FIELD_NAMES.FIRST_NAME: {
      if (!value || typeof value !== "string") return false;
      return true;
    }
    case FIELD_NAMES.LAST_NAME: {
      if (value && typeof value !== "string") return false;
      return true;
    }

    case FIELD_NAMES.ADDRESS: {
      if (!value || typeof value !== "string" || !ethers.utils.isAddress(value))
        return false;
      return true;
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

    case FIELD_NAMES.DEPARTMENT_NAME: {
      if (!value || typeof value !== "string") return false;
      return true;
    }
    default:
      return false;
  }
};
