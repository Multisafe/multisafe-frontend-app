import React, { useState, useEffect, useCallback, memo, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { format } from "date-fns";
import { cryptoUtils } from "parcel-sdk";
import { Link } from "react-router-dom";

import { useLocalStorage } from "hooks";
import { routeTemplates } from "constants/routes/templates";
import transactionsReducer from "store/transactions/reducer";
import transactionsSaga from "store/transactions/saga";
import { viewTransactions } from "store/transactions/actions";
import {
  makeSelectTransactions,
  makeSelectFetching as makeSelectLoadingTransactions,
} from "store/transactions/selectors";
import viewPeopleReducer from "store/view-people/reducer";
import viewPeopleSaga from "store/view-people/saga";
import { getAllPeople } from "store/view-people/actions";
import {
  makeSelectPeople,
  makeSelectLoading as makeSelectLoadingTeammates,
} from "store/view-people/selectors";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import {
  makeSelectOrganisationType,
  makeSelectOwnerSafeAddress,
} from "store/global/selectors";
// import Loading from "components/common/Loading";
// import { TransactionUrl } from "components/common/Web3Utils";

// import TeamMembersPng from "assets/images/team-members.png";
// import TeamPng from "assets/images/user-team.png";
import IncomingIcon from "assets/icons/dashboard/incoming.svg";
// import CancelledIcon from "assets/icons/dashboard/cancelled.svg";

import { RecentTx } from "./styles";
import Img from "components/common/Img";
import { TRANSACTION_MODES, TRANSACTION_STATUS } from "constants/transactions";

const transactionsKey = "transactions";
const viewPeopleKey = "viewPeople";

const STATES = {
  EMPTY_STATE: "EMPTY_STATE",
  TEAMMATES_ADDED: "TEAMMATES_ADDED",
  TRANSACTION_EXECUTED: "TRANSACTION_EXECUTED",
};

function RecentTxCard() {
  const [encryptionKey] = useLocalStorage("ENCRYPTION_KEY");
  const [state, setState] = useState(STATES.EMPTY_STATE);
  const [loading, setLoading] = useState(true);
  const [transactionData, setTransactionData] = useState();

  useInjectReducer({ key: transactionsKey, reducer: transactionsReducer });
  useInjectReducer({ key: viewPeopleKey, reducer: viewPeopleReducer });

  useInjectSaga({ key: transactionsKey, saga: transactionsSaga });
  useInjectSaga({ key: viewPeopleKey, saga: viewPeopleSaga });

  const dispatch = useDispatch();

  const transactions = useSelector(makeSelectTransactions());
  const loadingTransactions = useSelector(makeSelectLoadingTransactions());
  const loadingTeammates = useSelector(makeSelectLoadingTeammates());
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());
  const organisationType = useSelector(makeSelectOrganisationType());
  const teammates = useSelector(makeSelectPeople());

  const getDecryptedDetails = useCallback(
    (data) => {
      if (!encryptionKey) return "";
      return JSON.parse(
        cryptoUtils.decryptDataUsingEncryptionKey(
          data,
          encryptionKey,
          organisationType
        )
      );
    },
    [encryptionKey, organisationType]
  );

  useEffect(() => {
    if (ownerSafeAddress) {
      dispatch(viewTransactions(ownerSafeAddress));
      dispatch(getAllPeople(ownerSafeAddress));
    }
  }, [dispatch, ownerSafeAddress]);

  useEffect(() => {
    if (!loadingTransactions && !loadingTeammates && loading) setLoading(false);
  }, [loadingTeammates, loadingTransactions, loading]);

  useEffect(() => {
    if (
      teammates &&
      teammates.length > 0 &&
      state !== STATES.TRANSACTION_EXECUTED
    ) {
      setState(STATES.TEAMMATES_ADDED);
    } else if (state !== STATES.TRANSACTION_EXECUTED) {
      setState(STATES.EMPTY_STATE);
    }
  }, [teammates, state]);

  useEffect(() => {
    if (transactions && transactions.length > 0) {
      setState(STATES.TRANSACTION_EXECUTED);
      setTransactionData(transactions);
    }
  }, [transactions]);

  const stepTitle = useMemo(() => {
    switch (state) {
      case STATES.EMPTY_STATE:
        return `Add Team Members`;
      case STATES.TEAMMATES_ADDED:
        return `Your Teammates`;
      case STATES.TRANSACTION_EXECUTED:
        return `Recent Transactions`;
      default:
        return null;
    }
  }, [state]);

  const linkByState = useMemo(() => {
    switch (state) {
      case STATES.EMPTY_STATE:
        return routeTemplates.dashboard.people;
      case STATES.TEAMMATES_ADDED:
        return routeTemplates.dashboard.people;
      case STATES.TRANSACTION_EXECUTED:
        return routeTemplates.dashboard.transactions;
      default:
        return null;
    }
  }, [state]);

  const renderStatusText = (status) => {
    switch (status) {
      case TRANSACTION_STATUS.COMPLETED:
        return <div className="text-green">Completed</div>;
      case TRANSACTION_STATUS.PENDING:
        return <div className="text-orange">Pending</div>;
      case TRANSACTION_STATUS.FAILED:
        return <div className="text-red">Failed</div>;
      default:
        return null;
    }
  };

  const renderName = (to, transactionMode) => {
    if (transactionMode === TRANSACTION_MODES.QUICK_TRANSFER) {
      return "Quick Transfer";
    } else if (transactionMode === TRANSACTION_MODES.SPENDING_LIMITS) {
      return "New Spending Limit";
    } else if (transactionMode === TRANSACTION_MODES.MASS_PAYOUT) {
      const payeeDetails = getDecryptedDetails(to);

      const { firstName, lastName } = payeeDetails[0];
      const firstPersonName = `${firstName} ${lastName}`;

      return payeeDetails.length === 1
        ? `${firstPersonName}`
        : `${firstPersonName} and ${payeeDetails.length - 1} more`;
    }
  };

  const renderTx = ({
    createdOn,
    fiatCurrency,
    fiatValue,
    tokenCurrency,
    tokenValue,
    transactionMode,
    transactionId,
    to,
    status,
  }) => {
    return (
      <div className="tx" key={transactionId}>
        <div className="tx-info">
          <Img src={IncomingIcon} alt="tx-icon" className="mr-4" />
          <div>
            <div className="top">{renderName(to, transactionMode)}</div>
            <div className="bottom">
              {format(new Date(createdOn), "dd MMM yyyy")}
            </div>
          </div>
        </div>
        <div className="tx-amounts">
          <div className="top">- ${parseFloat(fiatValue).toFixed(2)}</div>
          <div className="bottom">
            {parseFloat(tokenValue).toFixed(2)} {tokenCurrency}
          </div>
        </div>
        <div className="tx-status">{renderStatusText(status)}</div>
      </div>
    );
  };
  return (
    <RecentTx>
      <div className="title-container">
        <div className="title">{stepTitle}</div>
        <Link to={linkByState} className="view">
          View All
        </Link>
      </div>
      <div className="tx-container">
        {transactionData &&
          transactionData.slice(0, 5).map((tx) => renderTx(tx))}
      </div>
    </RecentTx>
  );
}

export default memo(RecentTxCard);
