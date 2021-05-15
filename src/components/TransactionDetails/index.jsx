import React from "react";
import { useSelector } from "react-redux";

import MultiSigTransactionDetails from "./MultiSigTransactionDetails";
import SingleOwnerTransactionDetails from "./TransactionDetails";
import { makeSelectIsMultiOwner } from "store/global/selectors";

export default function TransactionDetails() {
  const isMultiOwner = useSelector(makeSelectIsMultiOwner());

  return isMultiOwner ? (
    <MultiSigTransactionDetails />
  ) : (
    <SingleOwnerTransactionDetails />
  );
}
