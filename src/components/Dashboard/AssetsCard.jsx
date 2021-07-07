import React, { useState, useEffect, memo, useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import Loading from "components/common/Loading";
import Img from "components/common/Img";
import {
  makeSelectLoading as makeSelectLoadingTokens,
  makeSelectTokenList,
} from "store/tokens/selectors";
import { defaultTokenDetails } from "constants/index";
import NoAssetsImg from "assets/icons/dashboard/empty/assets.svg";
import { formatNumber } from "utils/number-helpers";
import { routeGenerators } from "constants/routes/generators";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";

import { Assets } from "./styles";

function AssetsCard() {
  const [tokenDetails, setTokenDetails] = useState(defaultTokenDetails);

  // Selectors
  const tokenList = useSelector(makeSelectTokenList());
  const loading = useSelector(makeSelectLoadingTokens());
  const safeAddress = useSelector(makeSelectOwnerSafeAddress());

  useEffect(() => {
    if (tokenList && tokenList.length > 0) {
      setTokenDetails(tokenList.slice(0, 2));
    }
  }, [tokenList]);

  const isAssetsEmpty = useMemo(() => {
    return (
      tokenList &&
      tokenList.length >= 0 &&
      tokenList.every(({ balance, usd }) => !balance && !usd)
    );
  }, [tokenList]);

  const renderAssetCard = ({ icon, name, balance, usd }) => (
    <div className="asset-card" key={name}>
      <div className="token-details">
        <Img src={icon} alt={name} className="token-icon" />
        <div>
          <div className="token-name">{name}</div>
          <div className="token-amount">{formatNumber(balance, 5)}</div>
        </div>
      </div>
      <div className="usd">${formatNumber(usd)}</div>
    </div>
  );
  return (
    <Assets>
      <div className="title-container">
        <div className="title">Assets</div>
        <Link
          to={routeGenerators.dashboard.assets({ safeAddress })}
          className="view"
        >
          View All
        </Link>
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
      {!loading && !isAssetsEmpty && (
        <React.Fragment>
          <div className="assets-container">
            {tokenDetails.map((detail) => renderAssetCard(detail))}
          </div>
        </React.Fragment>
      )}
    </Assets>
  );
}

export default memo(AssetsCard);
