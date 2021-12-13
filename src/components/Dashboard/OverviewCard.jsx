import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import overviewReducer from "store/overview/reducer";
import overviewSaga from "store/overview/saga";
import { getOverview, getPortfolioHistory } from "store/overview/actions";
import {
  makeSelectTotalBalance,
  makeSelectLoading as makeSelectLoadingTokens,
} from "store/tokens/selectors";
import Loading from "components/common/Loading";
import { formatNumber } from "utils/number-helpers";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import PortfolioGraph from "./PortfolioGraph";
import { Overview } from "./styles";
import { getTokens } from "store/tokens/actions";
import {useActiveWeb3React} from "hooks";

const overviewKey = "overview";

export default function OverviewCard() {
  const dispatch = useDispatch();
  const {chainId} = useActiveWeb3React();

  // Reducers
  useInjectReducer({ key: overviewKey, reducer: overviewReducer });

  // Sagas
  useInjectSaga({ key: overviewKey, saga: overviewSaga });

  const totalBalance = useSelector(makeSelectTotalBalance());
  const loadingTokens = useSelector(makeSelectLoadingTokens());
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());

  useEffect(() => {
    if (ownerSafeAddress) {
      dispatch(getOverview(ownerSafeAddress));
      dispatch(getTokens(ownerSafeAddress, chainId));
      dispatch(getPortfolioHistory(ownerSafeAddress));
    }
  }, [ownerSafeAddress, dispatch, chainId]);

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
      <div className="graph">
        <PortfolioGraph />
      </div>
    </Overview>
  );
}
