import React, { memo } from "react";
import { useSelector } from "react-redux";

import Loading from "components/common/Loading";
import { formatNumber } from "utils/number-helpers";
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

const overviewKey = "overview";

function ExpensesCard() {
  // Reducers
  useInjectReducer({ key: overviewKey, reducer: overviewReducer });

  // Sagas
  useInjectSaga({ key: overviewKey, saga: overviewSaga });

  // Selectors
  const loadingOverview = useSelector(makeSelectLoadingOverview());
  const moneyIn = useSelector(makeSelectMoneyIn());
  const moneyOut = useSelector(makeSelectMoneyOut());

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
        <div className="heading">Income</div>
        <div className="value-container">
          <span className="plus">+</span> ${formatNumber(moneyIn)}
          {loadingOverview && renderLoading()}
        </div>
      </div>
      <div className="money-out">
        <div className="heading">Expense</div>
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
        <div className="title">Income and Expense</div>
        <div className="last-30">Last 30 days</div>
      </div>
      {loadingOverview && (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ height: "30rem" }}
        >
          <Loading color="primary" width="3rem" height="3rem" />
        </div>
      )}
      {!loadingOverview && (
        <React.Fragment>
          <ExpensesGraph moneyIn={moneyIn} moneyOut={moneyOut} />
          <div className="divider" />
          {renderMoneyInOut()}
        </React.Fragment>
      )}
    </Expense>
  );
}

export default memo(ExpensesCard);
