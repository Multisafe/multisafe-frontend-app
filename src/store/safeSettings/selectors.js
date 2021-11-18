import { safeSettingsKey } from "./reducer";

const selectSafeSettingsKey = (state) => state[safeSettingsKey];

export const selectSafeSettingsLoading = (state) =>
  selectSafeSettingsKey(state)?.loading;
export const selectSafeSettingsError = (state) =>
  selectSafeSettingsKey(state)?.error;
export const selectSafeSettings = (state) =>
  selectSafeSettingsKey(state)?.settings;

export const selectSafeGasSettings = (state) =>
  selectSafeSettings(state)?.gasSetting;
