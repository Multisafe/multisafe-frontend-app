import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import { useEncryptionKey } from "hooks";
import transactionsReducer from "store/transactions/reducer";
import transactionsSaga from "store/transactions/saga";
import { getTransactionById } from "store/transactions/actions";
import {
  makeSelectFetching,
  makeSelectTransactionDetails,
} from "store/transactions/selectors";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import { makeSelectOrganisationType } from "store/global/selectors";
import { InfoCard } from "components/People/styles";
import Loading from "components/common/Loading";
import { getDecryptedDetails } from "utils/encryption";
import DisbursementDetails from "./DisbursementDetails";
import Summary from "./Summary";
import {TransactionDescription} from "./TransactionDescription";

const transactionsKey = "transactions";

export default function TransactionDetails() {
  const [encryptionKey] = useEncryptionKey();

  useInjectReducer({ key: transactionsKey, reducer: transactionsReducer });

  // Sagas
  useInjectSaga({ key: transactionsKey, saga: transactionsSaga });

  const dispatch = useDispatch();
  const params = useParams();

  const loading = useSelector(makeSelectFetching());
  const transactionDetails = useSelector(makeSelectTransactionDetails());
  const organisationType = useSelector(makeSelectOrganisationType());

  useEffect(() => {
    const transactionId = params && params.transactionId;
    const safeAddress = params && params.safeAddress;
    dispatch(getTransactionById(safeAddress, transactionId));
  }, [dispatch, params]);

  const renderTransactionDetails = () => {
    if (loading)
      return (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ height: "40rem" }}
        >
          <Loading color="primary" width="3rem" height="3rem" />
        </div>
      );

    if (!transactionDetails) return null;

    const { to, transactionMode, tokenCurrency, metaData } = transactionDetails;
    const decryptedDetails = getDecryptedDetails(
      to,
      encryptionKey,
      organisationType
    );

    return (
      <div>
        <InfoCard style={{ minHeight: "0" }}>
          <div>
            <div className="title mb-0">Transaction Status</div>
          </div>
        </InfoCard>


        <TransactionDescription
          decryptedDetails={decryptedDetails}
          transactionMode={transactionMode}
          metaData={metaData}
        />

        <DisbursementDetails
          paidTeammates={decryptedDetails}
          transactionMode={transactionMode}
          tokenCurrency={tokenCurrency}
          metaData={metaData}
        />

        <Summary txDetails={transactionDetails} paidTeammates={decryptedDetails} />
      </div>
    );
  };

  return renderTransactionDetails();
}
