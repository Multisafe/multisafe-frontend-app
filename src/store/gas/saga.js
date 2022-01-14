import { call, put, delay, race, take } from "redux-saga/effects";
import { BigNumber } from "ethers";
import Big from "big.js";

import { getGasPriceSuccess, getGasPriceError } from "./actions";
import { request } from "utils/request";
import { gasPriceEndpoint } from "constants/endpoints";
import { ONE_GWEI } from "constants/index";
import { GAS_MODES } from "./constants";

const STOP_GAS_POLLING = "STOP_GAS_POLLING";
const POLLING_INTERVAL = 20000; // 20s

function roundWei(value) {
  // round decimals
  const roundedWei = Big(value)
    .div(Big(ONE_GWEI))
    .round(0)
    .mul(Big(ONE_GWEI))
    .toString();

  return BigNumber.from(roundedWei);
}

export function* getGasPrices() {
  const requestURL = `${gasPriceEndpoint}`;
  const options = {
    method: "GET",
  };

  while (true) {
    try {
      const result = yield call(request, requestURL, options);
      const { gasPrices } = result;
      yield put(
        getGasPriceSuccess({
          [GAS_MODES.STANDARD]: roundWei(gasPrices["standard"]),
          [GAS_MODES.FAST]: roundWei(gasPrices["fast"]),
          [GAS_MODES.INSTANT]: roundWei(gasPrices["rapid"]),
        })
      );
      yield delay(POLLING_INTERVAL);
    } catch (err) {
      yield put(getGasPriceError(err));
      yield put({ type: STOP_GAS_POLLING, err });
    }
  }
}

export default function* watchGetGasPrices() {
  yield race([call(getGasPrices), take(STOP_GAS_POLLING)]);
}
