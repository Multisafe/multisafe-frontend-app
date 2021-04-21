import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { makeSelectOwnerName } from "store/global/selectors";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";

import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import OverviewCard from "./OverviewCard";
import AssetsCard from "./AssetsCard";
import RecentTxCard from "./RecentTxCard";
import tokensReducer from "store/tokens/reducer";
import tokensSaga from "store/tokens/saga";
import { getTokens } from "store/tokens/actions";

import { Greeting, CardsGrid } from "./styles";

const tokensKey = "tokens";

export default function Dashboard() {
  const dispatch = useDispatch();

  // Reducers
  useInjectReducer({ key: tokensKey, reducer: tokensReducer });

  // Sagas
  useInjectSaga({ key: tokensKey, saga: tokensSaga });

  const ownerName = useSelector(makeSelectOwnerName());
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());

  useEffect(() => {
    if (ownerSafeAddress) {
      dispatch(getTokens(ownerSafeAddress));
    }
  }, [ownerSafeAddress, dispatch]);

  return (
    <div>
      <Greeting>Hey, {ownerName}</Greeting>
      <CardsGrid>
        <OverviewCard />
        <AssetsCard />
        <RecentTxCard />
      </CardsGrid>
    </div>
  );
}
