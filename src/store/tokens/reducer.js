import produce from "immer";
import { getAmountFromWei } from "utils/tx-helpers";

import {
  GET_TOKENS,
  GET_TOKENS_ERROR,
  GET_TOKENS_SUCCESS,
  ADD_CUSTOM_TOKEN,
  ADD_CUSTOM_TOKEN_ERROR,
  ADD_CUSTOM_TOKEN_SUCCESS,
  SET_SUCCESS,
  GET_TOKEN_LIST,
  GET_TOKEN_LIST_SUCCESS,
  GET_TOKEN_LIST_ERROR,
} from "./action-types";
import { DEFAULT_TOKEN_DETAILS } from "constants/index";
import { constructLabel } from "utils/tokens";

export const initialState = {
  log: "",
  loading: false,
  updating: false,
  success: false,
  error: false,
  tokenList: [],
  prices: null,
  tokensDropdown: [],
  tokenDetails: null,
  icons: null,
  totalBalance: "0.00",
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    const networkId = localStorage.getItem("NETWORK_ID");

    switch (action.type) {
      case GET_TOKENS:
        draft.loading = true;
        draft.error = false;
        break;

      case GET_TOKENS_SUCCESS:
        const allTokenDetails =
          action.tokens &&
          action.tokens
            .map(({ tokenDetails, balanceDetails }, idx) => {
              if (!tokenDetails) return null;

              const address = tokenDetails.tokenInfo.address;

              const balance = balanceDetails?.balance
                ? getAmountFromWei(
                    balanceDetails.balance,
                    tokenDetails.tokenInfo.decimals
                  )
                : 0;

              const usdPrice = action.prices[address] || 0;

              return {
                id: idx,
                name: tokenDetails.tokenInfo.symbol,
                balance,
                usd: balance * usdPrice,
                address,
                decimals: tokenDetails.tokenInfo.decimals,
                usdConversionRate: usdPrice,
              };
            })
            .filter(Boolean);

        const defaultTokenDetails = DEFAULT_TOKEN_DETAILS[networkId];

        if (allTokenDetails.length < 4) {
          for (let i = 0; i < defaultTokenDetails.length; i++) {
            if (
              !allTokenDetails.find(
                ({ name }) => name === defaultTokenDetails[i].name
              )
            ) {
              allTokenDetails.push(defaultTokenDetails[i]);
            }
          }
        }

        const total = allTokenDetails.reduce(
          (sum, token) => (sum += token.usd ? parseFloat(token.usd) : 0),
          0
        );

        draft.tokenList = allTokenDetails;
        draft.totalBalance = parseFloat(total).toFixed(2);
        draft.prices = action.prices;
        draft.loading = false;
        draft.log = action.log;
        // draft.icons = action.icons;
        break;

      case GET_TOKENS_ERROR:
        draft.loading = false;
        draft.tokenList = DEFAULT_TOKEN_DETAILS[networkId];
        draft.error = action.error;
        break;

      case GET_TOKEN_LIST:
        draft.loading = true;
        draft.error = false;
        break;

      case GET_TOKEN_LIST_SUCCESS:
        draft.loading = false;
        draft.log = action.log;
        draft.tokensDropdown = Object.keys(action.tokenDetails).map(
          (tokenAddress) => ({
            value: `${tokenAddress} ${action.tokenDetails[tokenAddress].symbol}`,
            label: constructLabel({
              token: action.tokenDetails[tokenAddress].symbol,
              imgUrl: action.tokenDetails[tokenAddress].logoURI,
            }),
          })
        );
        draft.icons = Object.keys(action.tokenDetails).reduce((map, key) => {
          map[key] = action.tokenDetails[key].logoURI;
          return map;
        }, {});
        draft.tokenDetails = action.tokenDetails;
        break;

      case GET_TOKEN_LIST_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;

      case ADD_CUSTOM_TOKEN:
        draft.updating = true;
        draft.success = false;
        draft.error = false;
        break;

      case ADD_CUSTOM_TOKEN_SUCCESS:
        draft.updating = false;
        draft.log = action.log;
        draft.success = true;
        break;

      case ADD_CUSTOM_TOKEN_ERROR:
        draft.error = action.error;
        draft.updating = false;
        draft.success = false;
        break;

      case SET_SUCCESS:
        draft.success = action.bool;
    }
  });

export default reducer;
