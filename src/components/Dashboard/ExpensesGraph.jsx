import Img from "components/common/Img";
import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

import { formatNumber } from "utils/number-helpers";
import ExpensesIcon from "assets/icons/dashboard/empty/expenses.svg";

import { EmptyExpenses, ExpensesLegend, PortfolioLabel } from "./styles";

const COLORS = ["#687fdc", "#cad2f3"];

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

const TX_TYPES = { MONEY_IN: "Incoming", MONEY_OUT: "Outgoing" };

export default function ExpensesGraph({ moneyIn, moneyOut }) {
  const [chartData, setChartData] = useState();

  useEffect(() => {
    if (!moneyIn && !moneyOut) setChartData();
    else {
      setChartData([
        {
          name: TX_TYPES.MONEY_IN,
          value: moneyIn,
        },
        {
          name: TX_TYPES.MONEY_OUT,
          value: moneyOut,
        },
      ]);
    }
  }, [moneyIn, moneyOut]);

  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <ExpensesLegend>
        {payload.map((entry, index) => {
          const isMoneyIn = entry.value === TX_TYPES.MONEY_IN;

          return (
            <div className="legend-item" key={`item-${index}`}>
              <div
                className={`${isMoneyIn ? "income-circle" : "expense-circle"}`}
              ></div>
              <div>{isMoneyIn ? TX_TYPES.MONEY_IN : TX_TYPES.MONEY_OUT}</div>
            </div>
          );
        })}
      </ExpensesLegend>
    );
  };

  return chartData && chartData.length ? (
    <ResponsiveContainer maxHeight="28rem" width="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          // outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "#fafafa" }} />
        <Legend content={renderLegend} />
      </PieChart>
    </ResponsiveContainer>
  ) : (
    <EmptyExpenses>
      <Img src={ExpensesIcon} alt="no-expense" width="200" />
      <div className="text mt-4">No Incoming and Outgoing Transactions</div>
    </EmptyExpenses>
  );
}
