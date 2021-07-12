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
import { ExpensesLegend, PortfolioLabel } from "./styles";

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

export default function ExpensesGraph({ moneyIn, moneyOut }) {
  const [chartData, setChartData] = useState();
  useEffect(() => {
    if (!moneyIn && !moneyOut) setChartData();
    else {
      setChartData([
        {
          name: "Income",
          value: moneyIn,
        },
        {
          name: "Expense",
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
          const isIncome = entry.value === "Income";

          return (
            <div className="legend-item" key={`item-${index}`}>
              <div
                className={`${isIncome ? "income-circle" : "expense-circle"}`}
              ></div>
              <div>{isIncome ? "Income" : "Expense"}</div>
            </div>
          );
        })}
      </ExpensesLegend>
    );
  };

  return chartData ? (
    <ResponsiveContainer maxHeight="28rem" width="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
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
    <div>No Income/Expenses in last 30 days</div>
  );
}
