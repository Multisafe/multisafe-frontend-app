import React from "react";
import { useSelector } from "react-redux";
import { AreaChart, Area, Tooltip, ResponsiveContainer } from "recharts";

import {
  makeSelectLoadingPortfolio,
  makeSelectPortfolioGraphData,
} from "store/overview/selectors";
import { formatNumber } from "utils/number-helpers";

import { PortfolioLabel, EmptyPortfolio } from "./styles";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <PortfolioLabel>
        <p className="label">
          {payload[0].payload.name} <span className="separator">|</span> $
          {formatNumber(payload[0].value, 2)}
        </p>
      </PortfolioLabel>
    );
  }

  return null;
};

export default function PortfolioGraph() {
  const portfolioGraphData = useSelector(makeSelectPortfolioGraphData());
  const loadingPortfolio = useSelector(makeSelectLoadingPortfolio());

  const renderGraph = () => {
    if (loadingPortfolio) return null;

    if (!loadingPortfolio && portfolioGraphData && !portfolioGraphData.length)
      return (
        <EmptyPortfolio>
          <div className="line" />
        </EmptyPortfolio>
      );

    return (
      <ResponsiveContainer height={80}>
        <AreaChart
          data={portfolioGraphData}
          margin={{
            top: 5,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <Area
            type="monotone"
            dataKey="value"
            stroke="#1452f5"
            fill="#e7eefe"
            strokeWidth="2"
          />
          <Tooltip content={<CustomTooltip />} />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  return renderGraph();
}
