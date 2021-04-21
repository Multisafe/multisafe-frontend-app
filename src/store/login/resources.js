export const STEPS = {
  ZERO: 0,
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
  SIX: 6,
};

export const FLOWS = {
  IMPORT: "IMPORT",
  LOGIN: "LOGIN",
  IMPORT_INDIVIDUAL: "IMPORT_INDIVIDUAL",
};

export const ORGANISATION_TYPE = {
  PRIVATE: "0",
  PUBLIC: "1",
};

export const LOGIN_STEPS = {
  [STEPS.ZERO]: "Connect",
  [STEPS.ONE]: "Privacy",
  [STEPS.TWO]: "Choose Account",
};

export const IMPORT_STEPS = {
  [STEPS.ZERO]: "Connect",
  [STEPS.ONE]: "Privacy",
  [STEPS.TWO]: "Choose Account",
  [STEPS.THREE]: "About You",
  [STEPS.FOUR]: "Owner Details",
  [STEPS.FIVE]: "Owner Address/Name",
  [STEPS.SIX]: "Review your entry",
};

export const IMPORT_INDIVIDUAL_STEPS = {
  [STEPS.ZERO]: "Connect",
  [STEPS.ONE]: "Privacy",
  [STEPS.TWO]: "Choose Account",
  [STEPS.THREE]: "Company Name",
  [STEPS.FOUR]: "Organisation Type",
};
