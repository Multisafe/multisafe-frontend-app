import React from "react";
import {
  BarChart,
  Bar,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { formatNumber } from "utils/number-helpers";
import { ExpensesLabel, ExpensesLegend } from "./styles";

const data = [
  {
    name: "Jun 7 - Jun 11",
    moneyIn: 9000,
    moneyOut: -2400,
  },
  {
    name: "Jun 11 - Jun 18",
    moneyIn: 3000,
    moneyOut: -1398,
  },
  {
    name: "Jun 18 - Jun 25",
    moneyIn: 0,
    moneyOut: -9800,
  },
  {
    name: "Jun 25 - Jul 2",
    moneyIn: 2780,
    moneyOut: -3908,
  },
  {
    name: "Jul 2 - Jul 9",
    moneyIn: 0,
    moneyOut: 0,
  },
  {
    name: "Jul 9 - Jul 16",
    moneyIn: 7090,
    moneyOut: -1800,
  },
  {
    name: "Jul 16 - Jul 23",
    moneyIn: 3000,
    moneyOut: -800,
  },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <ExpensesLabel>
        <p className="label">{`${payload[0].payload.name}`}</p>
        <p className="label">
          Money In{" "}
          <span style={{ color: "#74c251" }} className="ml-2">
            + ${formatNumber(payload[0].value, 2)}
          </span>
        </p>
        <p className="label">
          Money Out
          <span style={{ color: "#ff4660" }} className="ml-2">
            - ${formatNumber(Math.abs(payload[1].value), 2)}
          </span>
        </p>
      </ExpensesLabel>
    );
  }

  return null;
};

export default function ExpensesGraph() {
  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <ExpensesLegend>
        {payload.map((entry, index) => {
          const isMoneyIn = entry.value === "moneyIn";

          return (
            <div className="legend-item" key={`item-${index}`}>
              <div
                className={`${isMoneyIn ? "green-circle" : "red-circle"}`}
              ></div>
              <div>{isMoneyIn ? "Money In" : "Money Out"}</div>
            </div>
          );
        })}
      </ExpensesLegend>
    );
  };

  return (
    <ResponsiveContainer maxHeight="28rem" width="100%">
      <BarChart
        barGap={"15"}
        data={data}
        margin={{
          top: 10,
          right: 0,
          left: 0,
          bottom: 0,
        }}
      >
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "#fafafa" }} />
        <Legend content={renderLegend} />
        <ReferenceLine y={0} stroke="#f5f5f5" />
        <Bar dataKey="moneyIn" fill="#74c251" radius={[5, 5, 0, 0]} />
        <Bar dataKey="moneyOut" fill="#ff4660" radius={[5, 5, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
