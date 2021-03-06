import React, { useState, useEffect, memo, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { show } from "redux-modal";

import Loading from "components/common/Loading";
import Img from "components/common/Img";
import {
  makeSelectLoading as makeSelectLoadingTokens,
  makeSelectTokenList,
} from "store/tokens/selectors";
import { defaultTokenDetails } from "constants/index";
import { formatNumber } from "utils/number-helpers";
import { routeGenerators } from "constants/routes/generators";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import { MODAL_NAME as ADD_FUNDS_MODAL } from "components/AddFunds";
import AddFundsIcon from "assets/icons/navbar/add-funds.svg";

import { Assets } from "./styles";

function AssetsCard() {
  const [tokenDetails, setTokenDetails] = useState(defaultTokenDetails);

  const dispatch = useDispatch();

  // Selectors
  const tokenList = useSelector(makeSelectTokenList());
  const loading = useSelector(makeSelectLoadingTokens());
  const safeAddress = useSelector(makeSelectOwnerSafeAddress());

  useEffect(() => {
    if (tokenList && tokenList.length > 0) {
      setTokenDetails(tokenList.slice(0, 3));
    }
  }, [tokenList]);

  const showAddFundsModal = () => {
    dispatch(show(ADD_FUNDS_MODAL));
  };

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
          <div className="token-name">
            {formatNumber(balance, 5)} {name}
          </div>
          <div className="token-amount">${formatNumber(usd)}</div>
        </div>
      </div>
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
          style={{ height: "6rem" }}
        >
          <Loading color="primary" width="3rem" height="3rem" />
        </div>
      )}
      {!loading && isAssetsEmpty && (
        <div className="no-assets">
          <div className="text">No assets to show right now</div>
          <div className="add-funds" onClick={showAddFundsModal}>
            <Img src={AddFundsIcon} alt="add-funds" className="icon" />
            <div className="name">Add Funds</div>
          </div>
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
