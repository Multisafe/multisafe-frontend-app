import React from "react";
import { useSelector } from "react-redux";

import MultiSigTransactions from "./MultiSigTransactions";
import SingleOwnerTransactions from "./SingleOwnerTransactions";
import { makeSelectIsMultiOwner } from "store/global/selectors";

export default function Transactions() {
  const isMultiOwner = useSelector(makeSelectIsMultiOwner());

  return isMultiOwner ? <MultiSigTransactions /> : <SingleOwnerTransactions />;
}
