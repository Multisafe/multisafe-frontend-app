import React, { useState, useEffect, memo } from "react";
import { Link } from "react-router-dom";
import { Doughnut } from "react-chartjs-2";
import { useSelector } from "react-redux";

import Loading from "components/common/Loading";
import { routeTemplates } from "constants/routes/templates";
import Img from "components/common/Img";
import {
  makeSelectLoading as makeSelectLoadingTokens,
  makeSelectTokenList,
} from "store/tokens/selectors";
import { defaultTokenDetails } from "constants/index";

import { Assets } from "./styles";
import { formatNumber } from "utils/number-helpers";

const chartColors = [
  "#F1C40F",
  "#E74C3C",
  "#9B59B6",
  "#2E86C1",
  "#17A589",
  "#212F3C",
];

function AssetsCard() {
  const [tokenDetails, setTokenDetails] = useState(defaultTokenDetails);

  // Selectors
  const tokenList = useSelector(makeSelectTokenList());
  const loading = useSelector(makeSelectLoadingTokens());

  const [doughnutData, setDoughnutData] = useState();

  useEffect(() => {
    if (tokenList && tokenList.length > 0) {
      setTokenDetails(tokenList.slice(0, 4));
      const chartData = tokenList.reduce(
        (data, { name, usd }) => {
          data.labels.push(name);
          data.datasets[0].data.push(usd);
          return data;
        },
        {
          labels: [],
          datasets: [
            {
              data: [],
              backgroundColor: chartColors,
            },
          ],
        }
      );
      setDoughnutData(chartData);
    }
  }, [tokenList]);

  const renderAssetCard = ({ icon, name, balance, usd }) => (
    <div className="asset-card" key={name}>
      <div className="token-details">
        <Img src={icon} alt={name} className="token-icon" />
        <div>
          <div className="token-name">{name}</div>
          <div className="token-amount">{formatNumber(balance)}</div>
        </div>
      </div>
      <div className="usd">${formatNumber(usd)}</div>
    </div>
  );
  return (
    <Assets>
      <div className="title-container">
        <div className="title">Assets</div>
        <Link to={routeTemplates.dashboard.account} className="view">
          View All
        </Link>
      </div>
      {loading && (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ height: "30rem" }}
        >
          <Loading color="primary" width="50px" height="50px" />
        </div>
      )}
      {!loading && doughnutData && (
        <React.Fragment>
          <div className="chart-container">
            <Doughnut
              data={doughnutData}
              options={{ legend: { display: false } }}
              width={200}
              height={200}
            />
          </div>
          <div className="assets-container">
            {tokenDetails.map((detail) => renderAssetCard(detail))}
          </div>
        </React.Fragment>
      )}
    </Assets>
  );
}

export default memo(AssetsCard);
