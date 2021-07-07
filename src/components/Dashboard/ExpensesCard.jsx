import React, { memo, useMemo } from "react";
import { useSelector } from "react-redux";

import Loading from "components/common/Loading";
import Img from "components/common/Img";
import {
  makeSelectLoading as makeSelectLoadingTokens,
  makeSelectTokenList,
} from "store/tokens/selectors";
import NoAssetsImg from "assets/icons/dashboard/empty/assets.svg";
import { formatNumber } from "utils/number-helpers";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import ExpensesGraph from "./ExpensesGraph";

import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import overviewReducer from "store/overview/reducer";
import overviewSaga from "store/overview/saga";
import {
  makeSelectLoading as makeSelectLoadingOverview,
  makeSelectMoneyIn,
  makeSelectMoneyOut,
} from "store/overview/selectors";

import { Expense } from "./styles";

const expenseData = [];
const overviewKey = "overview";

function ExpensesCard() {
  // Selectors
  const tokenList = useSelector(makeSelectTokenList());
  const loading = useSelector(makeSelectLoadingTokens());
  const safeAddress = useSelector(makeSelectOwnerSafeAddress()); // eslint-disable-line

  // Reducers
  useInjectReducer({ key: overviewKey, reducer: overviewReducer });

  // Sagas
  useInjectSaga({ key: overviewKey, saga: overviewSaga });

  const loadingOverview = useSelector(makeSelectLoadingOverview());
  const moneyIn = useSelector(makeSelectMoneyIn());
  const moneyOut = useSelector(makeSelectMoneyOut());

  const isAssetsEmpty = useMemo(() => {
    return (
      tokenList &&
      tokenList.length >= 0 &&
      tokenList.every(({ balance, usd }) => !balance && !usd)
    );
  }, [tokenList]);

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

  const renderMoneyInOut = () => (
    <div className="money-in-out">
      <div className="money-in">
        <div className="heading">Money in last 30 days</div>
        <div className="value-container">
          <span className="plus">+</span> ${formatNumber(moneyIn)}
          {loadingOverview && renderLoading()}
        </div>
      </div>
      <div className="money-out">
        <div className="heading">Money out last 30 days</div>
        <div className="value-container grey">
          <span className="minus">-</span> ${formatNumber(moneyOut)}
          {loadingOverview && renderLoading()}
        </div>
      </div>
    </div>
  );

  return (
    <Expense>
      <div className="title-container">
        <div className="title">Spending Overview</div>
      </div>
      {loading && (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ height: "30rem" }}
        >
          <Loading color="primary" width="3rem" height="3rem" />
        </div>
      )}
      {!loading && isAssetsEmpty && (
        <div className="no-assets">
          <Img src={NoAssetsImg} alt="no-assets" />
          <div className="text">No Assets</div>
        </div>
      )}
      {!loading && !isAssetsEmpty && expenseData && (
        <React.Fragment>
          <ExpensesGraph />
          <div className="divider" />
          {renderMoneyInOut()}
        </React.Fragment>
      )}
    </Expense>
  );
}

export default memo(ExpensesCard);
