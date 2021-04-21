import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

import { Assets } from "./styles";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import tokensReducer from "store/tokens/reducer";
import tokensSaga from "store/tokens/saga";
import { getTokens } from "store/tokens/actions";
import {
  makeSelectLoading as makeSelectLoadingTokens,
  makeSelectTokenList,
  makeSelectTokenIcons,
} from "store/tokens/selectors";
import { Card } from "components/common/Card";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";

import { defaultTokenDetails, isTestnet } from "constants/index";
import Loading from "components/common/Loading";
import { formatNumber } from "utils/number-helpers";

const tokensKey = "tokens";

export default function AccountCard() {
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());

  // Reducers
  useInjectReducer({ key: tokensKey, reducer: tokensReducer });

  // Sagas
  useInjectSaga({ key: tokensKey, saga: tokensSaga });

  const dispatch = useDispatch();

  // Selectors
  const loading = useSelector(makeSelectLoadingTokens());
  const tokenList = useSelector(makeSelectTokenList());
  const icons = useSelector(makeSelectTokenIcons());
  // const error = useSelector(makeSelectError());

  const [totalBalance, setTotalBalance] = useState("0.00");
  // eslint-disable-next-line
  const [interestEarned, setInterestEarned] = useState("0.00");
  const [tokenDetails, setTokenDetails] = useState(defaultTokenDetails);

  useEffect(() => {
    if (ownerSafeAddress && !icons) {
      dispatch(getTokens(ownerSafeAddress));
    }
  }, [ownerSafeAddress, dispatch, icons]);

  useEffect(() => {
    if (tokenList && tokenList.length > 0) {
      setTokenDetails(tokenList.slice(0, 3));
    }
  }, [tokenList]);

  useEffect(() => {
    const total = tokenDetails.reduce(
      (sum, token) => (sum += parseFloat(token.usd)),
      0
    );
    setTotalBalance(parseFloat(total).toFixed(2));
  }, [tokenDetails]);

  return (
    <div className="account">
      <Card
        className="p-4"
        style={{
          width: "45em",
        }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <div className="card-title">Account</div>
            <div className="card-subtitle">
              Find overview of your account balances
            </div>
          </div>
          <Link to="/dashboard/account">
            <div className="circle">
              <FontAwesomeIcon icon={faArrowRight} color="#fff" />
            </div>
          </Link>
        </div>

        {loading ? (
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ height: "400px" }}
          >
            <Loading color="primary" width="50px" height="50px" />
          </div>
        ) : (
          <React.Fragment>
            <div className="overview-cards">
              <div className="overview-card">
                <div className="overview-text">Total Balance</div>
                <div className="overview-amount">
                  ${formatNumber(totalBalance)}
                </div>
              </div>
              <div className="overview-card">
                <div className="overview-text">Interest Earned</div>
                <div className="overview-coming-soon ">Coming Soon</div>
              </div>
            </div>
            {tokenDetails.map(({ id, name, icon, usd, balance }) => (
              <Assets key={id}>
                <div className="d-flex align-items-center">
                  <img src={icon} alt="ether" width="30" />
                  <div>
                    <div className="token-balance">{formatNumber(balance)}</div>
                    <div className="token-name">{name}</div>
                  </div>
                </div>
                <div className="token-usd">
                  <div className="token-usd-title">Total Value</div>
                  <div className="token-usd-amount">${formatNumber(usd)}</div>
                </div>
              </Assets>
            ))}
            {isTestnet && (
              <Link to="/dashboard/account" className="see-token">
                <span>Can't see your token?</span>
              </Link>
            )}
          </React.Fragment>
        )}
      </Card>
    </div>
  );
}
