import produce from "immer";
import { getAmountFromWei } from "utils/tx-helpers";
import {
  GET_GAS_PRICE,
  GET_GAS_PRICE_SUCCESS,
  GET_GAS_PRICE_ERROR,
  SET_SELECTED_GAS_PRICE,
} from "./action-types";

export const initialState = {
  loading: false,
  selectedGasPriceInWei: 0,
  selectedGasPrice: 0,
  gasPrices: undefined,
  error: false,
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case GET_GAS_PRICE:
        draft.loading = true;
        draft.error = false;
        break;

      case GET_GAS_PRICE_SUCCESS:
        draft.loading = false;
        draft.gasPrices = action.gasPrices;
        break;

      case GET_GAS_PRICE_ERROR:
        draft.loading = false;
        draft.error = action.error;
        break;

      case SET_SELECTED_GAS_PRICE:
        draft.selectedGasPriceInWei = action.gasPrice;
        const gas = getAmountFromWei(action.gasPrice.toString(), 9);
        draft.selectedGasPrice = gas;
    }
  });

export default reducer;
