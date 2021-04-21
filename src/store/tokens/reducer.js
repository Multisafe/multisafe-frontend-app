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
} from "./action-types";
import { defaultTokenDetails, getDefaultIconIfPossible } from "constants/index";
import DefaultIcon from "assets/icons/tokens/Default-icon.jpg";
import { constructLabel } from "utils/massPayout";

export const initialState = {
  log: "",
  loading: false,
  updating: false,
  success: false,
  error: false,
  tokenList: [],
  prices: null,
  tokensDropdown: [],
  icons: null,
  totalBalance: "0.00",
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
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
              const tokenIcon = getDefaultIconIfPossible(
                tokenDetails.tokenInfo.symbol,
                action.icons
              );
              // eslint-disable-next-line
              if (balanceDetails && balanceDetails.balance == 0) {
                return {
                  id: idx,
                  name: tokenDetails.tokenInfo.symbol,
                  icon:
                    tokenIcon || tokenDetails.tokenInfo.logoUri || DefaultIcon,
                  balance: 0,
                  usd: 0,
                  address: tokenDetails.tokenInfo.address,
                  decimals: tokenDetails.tokenInfo.decimals,
                  usdConversionRate: balanceDetails.usdConversion,
                };
              }
              // erc20
              const balance = getAmountFromWei(
                balanceDetails.balance,
                tokenDetails.tokenInfo.decimals
              );

              return {
                id: idx,
                name: tokenDetails.tokenInfo.symbol,
                icon:
                  tokenIcon || tokenDetails.tokenInfo.logoUri || DefaultIcon,
                balance,
                usd: balance * balanceDetails.fiatConversion,
                address: tokenDetails.tokenInfo.address,
                decimals: tokenDetails.tokenInfo.decimals,
                usdConversionRate: balanceDetails.usdConversion,
              };
            })
            .filter(Boolean);

        const dropdownList =
          action.tokens &&
          action.tokens.map(({ tokenDetails }) => ({
            value: tokenDetails.tokenInfo.symbol,
            label: constructLabel(
              tokenDetails.tokenInfo.symbol,
              getDefaultIconIfPossible(
                tokenDetails.tokenInfo.symbol,
                action.icons
              )
            ),
          }));
        if (allTokenDetails.length < 3) {
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
          (sum, token) => (sum += parseFloat(token.usd)),
          0
        );

        draft.tokenList = allTokenDetails;
        draft.tokensDropdown = dropdownList;
        draft.totalBalance = parseFloat(total).toFixed(2);
        draft.prices = action.prices;
        draft.loading = false;
        draft.log = action.log;
        draft.icons = action.icons;
        break;

      case GET_TOKENS_ERROR:
        draft.loading = false;
        draft.error = action.error;
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
