import React from "react";
import { useSelector } from "react-redux";

import {
  makeSelectIsReadOnly,
  makeSelectOrganisationType,
  makeSelectSafeOwners,
} from "store/global/selectors";

import OverviewCard from "./OverviewCard";
import ExpensesCard from "./ExpensesCard";
import AssetsCard from "./AssetsCard";
import RecentTxCard from "./RecentTxCard";

import { Greeting, CardsGrid } from "./styles";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { getDecryptedOwnerName } from "store/invitation/utils";
import { useEncryptionKey } from "hooks";

export default function Dashboard() {
  const [encryptionKey] = useEncryptionKey();
  const organisationType = useSelector(makeSelectOrganisationType());

  const isReadOnly = useSelector(makeSelectIsReadOnly());
  const safeOwners = useSelector(makeSelectSafeOwners());
  const { account } = useActiveWeb3React();

  const currentOwnerName = safeOwners.find(
    ({ owner }) => owner.toLowerCase() === account.toLowerCase()
  )?.name;
  const decryptedName = currentOwnerName
    ? getDecryptedOwnerName({
        encryptedName: currentOwnerName,
        encryptionKey,
        organisationType,
      })
    : "";

  return (
    <div>
      {!isReadOnly && decryptedName ? (
        <Greeting>Hey, {decryptedName}</Greeting>
      ) : null}
      <CardsGrid>
        <OverviewCard />
        <ExpensesCard />
        <RecentTxCard />
        <AssetsCard />
      </CardsGrid>
    </div>
  );
}
