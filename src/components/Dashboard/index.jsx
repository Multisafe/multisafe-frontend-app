import React from "react";
import { useSelector } from "react-redux";

import { makeSelectOwnerName } from "store/global/selectors";

import OverviewCard from "./OverviewCard";
import ExpensesCard from "./ExpensesCard";
import AssetsCard from "./AssetsCard";
import RecentTxCard from "./RecentTxCard";

import { Greeting, CardsGrid } from "./styles";

export default function Dashboard() {
  const ownerName = useSelector(makeSelectOwnerName());

  return (
    <div>
      <Greeting>Hey, {ownerName}</Greeting>
      <CardsGrid>
        <OverviewCard />
        <ExpensesCard />
        <RecentTxCard />
        <AssetsCard />
      </CardsGrid>
    </div>
  );
}
