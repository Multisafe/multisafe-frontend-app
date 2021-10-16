export const TRANSACTION_MODES: Record<string, number> = {
  MASS_PAYOUT: 0,
  QUICK_TRANSFER: 1,
  SPENDING_LIMITS: 2,
  ADD_SAFE_OWNER: 3,
  DELETE_SAFE_OWNER: 4,
  REPLACE_SAFE_OWNER: 5,
  CHANGE_THRESHOLD: 6,
  APPROVE_AND_SWAP: 7,
  FLEXIBLE_MASS_PAYOUT: 8,
};

export const TRANSACTION_STATUS: Record<string, number> = {
  COMPLETED: 0,
  PENDING: 1,
  FAILED: 2,
};
