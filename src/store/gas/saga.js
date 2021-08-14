import { call, put, delay, race, take } from "redux-saga/effects";
import { BigNumber } from "@ethersproject/bignumber";

import { getGasPriceSuccess, getGasPriceError } from "./actions";
import request from "utils/request";
import { ethGasStationEndpoint } from "constants/endpoints";
import { ONE_GWEI } from "constants/index";
import { GAS_MODES } from "./constants";

const STOP_GAS_POLLING = "STOP_GAS_POLLING";

function getGasInGwei(value) {
  return BigNumber.from(String(value)).mul(BigNumber.from(ONE_GWEI));
}

export function* getGasPrices() {
  const requestURL = `${ethGasStationEndpoint}`;
  const options = {
    method: "GET",
  };

  while (true) {
    try {
      const result = yield call(request, requestURL, options);
      yield put(
        getGasPriceSuccess({
          [GAS_MODES.STANDARD]: getGasInGwei(result["average"]),
          [GAS_MODES.FAST]: getGasInGwei(result["fast"]),
          [GAS_MODES.INSTANT]: getGasInGwei(result["fastest"]),
        })
      );
      yield delay(10000);
    } catch (err) {
      yield put(getGasPriceError(err));
      yield put({ type: STOP_GAS_POLLING, err });
    }
  }
}

export default function* watchGetGasPrices() {
  yield race([call(getGasPrices), take(STOP_GAS_POLLING)]);
}
