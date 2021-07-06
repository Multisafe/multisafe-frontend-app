import React from "react";
import { AreaChart, Area, Tooltip, ResponsiveContainer } from "recharts";
import { formatNumber } from "utils/number-helpers";
import { PortfolioLabel } from "./styles";

const data = [
  {
    name: "Jul 3 2021",
    value: 4000,
  },
  {
    name: "Jul 4 2021",
    value: 3000,
  },
  {
    name: "Jul 5 2021",
    value: 2000,
  },
  {
    name: "Jul 6 2021",
    value: 2780,
  },
  {
    name: "Jul 7 2021",
    value: 1890,
  },
  {
    name: "Jul 8 2021",
    value: 2390,
  },
  {
    name: "Jul 9 2021",
    value: 3490,
  },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <PortfolioLabel>
        <p className="label">{`${payload[0].payload.name} : $${formatNumber(
          payload[0].value,
          2
        )}`}</p>
      </PortfolioLabel>
    );
  }

  return null;
};

export default function PortfolioGraph() {
  return (
    <ResponsiveContainer height={80}>
      <AreaChart
        data={data}
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
}
