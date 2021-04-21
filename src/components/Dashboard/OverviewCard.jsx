import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import overviewReducer from "store/overview/reducer";
import overviewSaga from "store/overview/saga";
import { getOverview } from "store/overview/actions";
import {
  makeSelectLoading as makeSelectLoadingOverview,
  makeSelectMoneyIn,
  makeSelectMoneyOut,
} from "store/overview/selectors";
import {
  makeSelectTotalBalance,
  makeSelectLoading as makeSelectLoadingTokens,
} from "store/tokens/selectors";
import Loading from "components/common/Loading";
import { formatNumber } from "utils/number-helpers";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";

import { Overview } from "./styles";

const overviewKey = "overview";

export default function OverviewCard() {
  const dispatch = useDispatch();

  // Reducers
  useInjectReducer({ key: overviewKey, reducer: overviewReducer });

  // Sagas
  useInjectSaga({ key: overviewKey, saga: overviewSaga });

  const totalBalance = useSelector(makeSelectTotalBalance());
  const loadingTokens = useSelector(makeSelectLoadingTokens());
  const loadingOverview = useSelector(makeSelectLoadingOverview());
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());
  const moneyIn = useSelector(makeSelectMoneyIn());
  const moneyOut = useSelector(makeSelectMoneyOut());

  useEffect(() => {
    if (ownerSafeAddress) {
      dispatch(getOverview(ownerSafeAddress));
    }
  }, [ownerSafeAddress, dispatch]);

  const renderLoading = () => {
    return (
      <Loading
        color="primary"
        width="1.25rem"
        height="1.25rem"
        className="d-inline ml-2"
      />
    );
  };
  return (
    <Overview>
      <div className="left">
        <div className="total-balance">Total Balance</div>
        <div className="amount">
          <span className="symbol">$</span>
          <span className="value">
            {formatNumber(totalBalance.split(".")[0], 0)}
          </span>
          <span className="decimals">.{totalBalance.split(".")[1]}</span>
          {loadingTokens && renderLoading()}
        </div>
      </div>
      <div className="right">
        <div className="money-in">
          <div className="heading">Money in last month</div>
          <div className="value-container">
            <span className="plus">+</span> ${formatNumber(moneyIn)}
            {loadingOverview && renderLoading()}
          </div>
        </div>
        <div className="money-out">
          <div className="heading">Money out last month</div>
          <div className="value-container grey">
            <span className="minus">-</span> ${formatNumber(moneyOut)}
            {loadingOverview && renderLoading()}
          </div>
        </div>
      </div>
    </Overview>
  );
}
