import { call, put, takeLatest } from "redux-saga/effects";
import { BigNumber } from "@ethersproject/bignumber";

import { GET_GAS_PRICE } from "./action-types";
import { getGasPriceSuccess, getGasPriceError } from "./actions";
import request from "utils/request";
import { ethGasStationEndpoint } from "constants/endpoints";
import { ONE_GWEI } from "constants/index";
import { GAS_MODES } from "./constants";

function getGasInGwei(value) {
  return BigNumber.from(String(value)).mul(BigNumber.from(ONE_GWEI));
}

export function* getGasPrices() {
  const requestURL = `${ethGasStationEndpoint}`;
  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, requestURL, options);
    yield put(
      getGasPriceSuccess({
        [GAS_MODES.STANDARD]: getGasInGwei(result["average"]),
        [GAS_MODES.FAST]: getGasInGwei(result["fast"]),
        [GAS_MODES.INSTANT]: getGasInGwei(result["fastest"]),
      })
    );
  } catch (err) {
    yield put(getGasPriceError(err));
  }
}

export default function* watchGetGasPrices() {
  yield takeLatest(GET_GAS_PRICE, getGasPrices);
}
