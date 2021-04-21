import { isAddress } from "@ethersproject/address";
import { tokens } from "constants/index";

// check if the field is correct
export const FIELD_NAMES = {
  FIRST_NAME: "FIRST_NAME",
  LAST_NAME: "LAST_NAME",
  ADDRESS: "ADDRESS",
  AMOUNT: "AMOUNT",
  TOKEN: "TOKEN",
  DEPARTMENT_NAME: "DEPARTMENT_NAME",
};

export const isValidField = (fieldName, value) => {
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
      if (!value || typeof value !== "string" || !isAddress(value))
        return false;
      return true;
    }
    case FIELD_NAMES.AMOUNT: {
      if (!value || isNaN(Number(value))) return false;
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
