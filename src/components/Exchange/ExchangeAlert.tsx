import React from "react";
import { useSelector } from "react-redux";
import { Alert, AlertMessage } from "components/common/Alert";
import { makeSelectIsMultiOwner } from "store/global/selectors";

export const ExchangeAlert = React.memo(() => {
  const isMultiOwner = useSelector(makeSelectIsMultiOwner());

  return isMultiOwner ? (
    <Alert>
      <AlertMessage>
        The amount received can vary depending on the time when the swap
        transaction is finally executed. We recommend all the signers to sign
        and execute the transaction as soon as it is initiated.
      </AlertMessage>
    </Alert>
  ) : null;
});
