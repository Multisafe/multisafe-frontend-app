import { createSelector } from "reselect";
import { GAS_MODES } from "./constants";
import { initialState } from "./reducer";

const selctGasPrices = (state) => state.gas || initialState;

const makeSelectLoading = () =>
  createSelector(selctGasPrices, (gasPriceState) => gasPriceState.loading);

const makeSelectAllGasPrices = () =>
  createSelector(selctGasPrices, (gasPriceState) => gasPriceState.gasPrices);

const makeSelectSlowGasPrice = () =>
  createSelector(
    selctGasPrices,
    (gasPriceState) =>
      gasPriceState.gasPrices && gasPriceState.gasPrices[GAS_MODES.STANDARD]
  );

const makeSelectAverageGasPrice = () =>
  createSelector(
    selctGasPrices,
    (gasPriceState) =>
      gasPriceState.gasPrices && gasPriceState.gasPrices[GAS_MODES.FAST]
  );

const makeSelectFastGasPrice = () =>
  createSelector(
    selctGasPrices,
    (gasPriceState) =>
      gasPriceState.gasPrices && gasPriceState.gasPrices[GAS_MODES.INSTANT]
  );

const makeSelectSelectedGasPriceInWei = () =>
  createSelector(
    selctGasPrices,
    (gasPriceState) => gasPriceState.selectedGasPriceInWei
  );

const makeSelectSelectedGasPrice = () =>
  createSelector(
    selctGasPrices,
    (gasPriceState) => gasPriceState.selectedGasPrice
  );

const makeSelectError = () =>
  createSelector(selctGasPrices, (gasPriceState) => gasPriceState.error);

export {
  selctGasPrices,
  makeSelectAllGasPrices,
  makeSelectSelectedGasPriceInWei,
  makeSelectSelectedGasPrice,
  makeSelectSlowGasPrice,
  makeSelectAverageGasPrice,
  makeSelectFastGasPrice,
  makeSelectLoading,
  makeSelectError,
};
