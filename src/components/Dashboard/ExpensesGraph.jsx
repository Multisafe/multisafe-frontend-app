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
import { ExpensesLabel } from "./styles";

const data = [
  {
    name: "Jun 7 - Jun 11",
    moneyIn: 4000,
    moneyOut: -2400,
  },
  {
    name: "Jun 11 - Jun 18",
    moneyIn: 3000,
    moneyOut: -1398,
  },
  {
    name: "Jun 18 - Jun 25",
    moneyIn: 2000,
    moneyOut: -9800,
  },
  {
    name: "Jun 25 - Jul 2",
    moneyIn: 2780,
    moneyOut: -3908,
  },
  {
    name: "Jul 2 - Jul 9",
    moneyIn: 1890,
    moneyOut: -4800,
  },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <ExpensesLabel>
        <p className="label">{`${payload[0].payload.name}`}</p>
        <p className="label">{`Money In : +$${formatNumber(
          payload[0].value,
          2
        )}`}</p>
        <p className="label">{`Money Out : -$${formatNumber(
          Math.abs(payload[1].value),
          2
        )}`}</p>
      </ExpensesLabel>
    );
  }

  return null;
};

export default function ExpensesGraph() {
  return (
    <ResponsiveContainer maxHeight="28rem" width="90%">
      <BarChart
        barGap={"30"}
        data={data}
        margin={{
          top: 50,
          right: 0,
          left: 0,
          bottom: 5,
        }}
      >
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "#fafafa" }} />
        <Legend />
        <ReferenceLine y={0} stroke="#f5f5f5" />
        <Bar dataKey="moneyIn" fill="#74c251" radius={[5, 5, 0, 0]} />
        <Bar dataKey="moneyOut" fill="#ff4660" radius={[5, 5, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
