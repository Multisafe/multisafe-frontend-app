import { call, put, fork, takeLatest } from "redux-saga/effects";
import { GET_SAFE_SETTINGS, SET_SAFE_SETTINGS } from "./action-types";
import { ROOT_BE_URL } from "constants/endpoints";
import request from "utils/request";
import {
  getSafeSettingsError,
  getSafeSettingsSuccess,
} from "store/safeSettings/actions";
import { setGasMode } from "store/global/actions";
import { GAS_MODES } from "store/gas/constants";

const GAS_SETTINGS_TO_MODE = {
  standard: GAS_MODES.STANDARD,
  fast: GAS_MODES.FAST,
  instant: GAS_MODES.INSTANT,
};

function* getSafeSettings({ safeAddress, networkId }) {
  const endpoint = `${ROOT_BE_URL}/api/v1/safes/settings`;
  const urlParams = new URLSearchParams({ safeAddress, networkId }).toString();
  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, `${endpoint}?${urlParams}`, options);

    if (result.flag === 200) {
      yield put(getSafeSettingsSuccess({ settings: result.result.settings }));
      yield put(
        setGasMode(GAS_SETTINGS_TO_MODE[result.result.settings.gasSetting])
      );
    } else if (result.flag === 404) {
      yield put(getSafeSettingsError({ error: result.log }));
    }
  } catch (e) {
    yield put(getSafeSettingsError({ error: "Error fetching safe settings" }));
  }
}

function* setSafeSettings({
  safeAddress,
  networkId,
  userAddress,
  gasSetting,
  onSuccess,
  onError,
}) {
  const endpoint = `${ROOT_BE_URL}/api/v1/safes/settings`;
  const options = {
    method: "PUT",
    body: JSON.stringify({
      safeAddress,
      networkId,
      userAddress,
      gasSetting,
    }),
  };

  try {
    const result = yield call(request, endpoint, options);

    if (result.flag === 200) {
      yield getSafeSettings({ safeAddress, networkId });
      onSuccess && onSuccess();
    }
  } catch (e) {
    onError && onError();
  }
}

function* watchGetSafeSettings() {
  yield takeLatest(GET_SAFE_SETTINGS, getSafeSettings);
}

function* watchSetSafeSettings() {
  yield takeLatest(SET_SAFE_SETTINGS, setSafeSettings);
}

export default function* watchSafeSettings() {
  yield fork(watchGetSafeSettings);
  yield fork(watchSetSafeSettings);
}
