import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import { useLocalStorage } from "hooks";
import transactionsReducer from "store/transactions/reducer";
import transactionsSaga from "store/transactions/saga";
import { getTransactionById } from "store/transactions/actions";
import {
  makeSelectFetching,
  makeSelectTransactionDetails,
} from "store/transactions/selectors";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import {
  makeSelectOrganisationType,
  makeSelectOwnerSafeAddress,
} from "store/global/selectors";
import { InfoCard } from "components/People/styles";
import Loading from "components/common/Loading";
import { DescriptionCard, DisbursementCard } from "./styles";
import { getDecryptedDetails } from "utils/encryption";
import DisbursementDetails from "./DisbursementDetails";
import Summary from "./Summary";

const transactionsKey = "transactions";

export default function TransactionDetails() {
  const [encryptionKey] = useLocalStorage("ENCRYPTION_KEY");

  useInjectReducer({ key: transactionsKey, reducer: transactionsReducer });

  // Sagas
  useInjectSaga({ key: transactionsKey, saga: transactionsSaga });

  const dispatch = useDispatch();
  const params = useParams();

  const loading = useSelector(makeSelectFetching());
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());
  const transactionDetails = useSelector(makeSelectTransactionDetails());
  const organisationType = useSelector(makeSelectOrganisationType());

  useEffect(() => {
    if (ownerSafeAddress) {
      const transactionId = params && params.transactionId;
      dispatch(getTransactionById(ownerSafeAddress, transactionId));
    }
  }, [dispatch, ownerSafeAddress, params]);

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

    if (!transactionDetails || !encryptionKey) return null;

    const { to, transactionMode, tokenCurrency } = transactionDetails;
    const paidTeammates = getDecryptedDetails(
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

        <DescriptionCard>
          <div className="title">Description</div>
          <div className="subtitle">
            {paidTeammates &&
            paidTeammates.length > 0 &&
            paidTeammates[0].description
              ? paidTeammates[0].description
              : `No description given...`}
          </div>
        </DescriptionCard>

        <DisbursementCard>
          <div className="title">Disbursement Details</div>
          <DisbursementDetails
            paidTeammates={paidTeammates}
            transactionMode={transactionMode}
            tokenCurrency={tokenCurrency}
          />
        </DisbursementCard>

        <Summary txDetails={transactionDetails} paidTeammates={paidTeammates} />
      </div>
    );
  };

  return renderTransactionDetails();
}
