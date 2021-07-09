import produce from "immer";
import { format } from "date-fns";

import {
  GET_OVERVIEW,
  GET_OVERVIEW_SUCCESS,
  GET_OVERVIEW_ERROR,
  GET_PORTFOLIO_HISTORY,
  GET_PORTFOLIO_HISTORY_SUCCESS,
  GET_PORTFOLIO_HISTORY_ERROR,
} from "./action-types";

export const initialState = {
  loading: false,
  moneyIn: 0,
  moneyOut: 0,
  error: false,
  loadingPortfolio: false,
  portfolioGraphData: undefined,
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case GET_OVERVIEW:
        draft.loading = true;
        draft.error = false;
        break;

      case GET_OVERVIEW_ERROR:
        draft.loading = false;
        draft.error = action.error;
        break;

      case GET_OVERVIEW_SUCCESS:
        draft.loading = false;
        draft.moneyIn = action.moneyIn;
        draft.moneyOut = action.moneyOut;
        break;

      case GET_PORTFOLIO_HISTORY:
        draft.loadingPortfolio = true;
        draft.error = false;
        break;

      case GET_PORTFOLIO_HISTORY_ERROR:
        draft.loadingPortfolio = false;
        draft.error = action.error;
        break;

      case GET_PORTFOLIO_HISTORY_SUCCESS:
        draft.loadingPortfolio = false;
        draft.portfolioGraphData = action.portfolioGraphData.map(
          ({ name, value }) => ({
            name: format(new Date(name), "MMM dd yyyy"),
            value,
          })
        );
        break;
    }
  });

export default reducer;
