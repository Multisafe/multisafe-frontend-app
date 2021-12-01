import React, { useState, useEffect, memo, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { format } from "date-fns";
import { Link } from "react-router-dom";

import { useEncryptionKey } from "hooks";
import transactionsReducer from "store/transactions/reducer";
import transactionsSaga from "store/transactions/saga";
import { viewTransactions } from "store/transactions/actions";
import {
  makeSelectTransactions,
  makeSelectFetching as makeSelectLoadingTransactions,
} from "store/transactions/selectors";
import viewPeopleReducer, { viewPeopleKey } from "store/view-people/reducer";
import viewPeopleSaga from "store/view-people/saga";
import { getAllPeople } from "store/view-people/actions";
import {
  makeSelectPeople,
  makeSelectLoading as makeSelectLoadingPeople,
} from "store/view-people/selectors";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import {
  makeSelectOrganisationType,
  makeSelectOwnerSafeAddress,
} from "store/global/selectors";
import { getDecryptedDetails } from "utils/encryption";
import IncomingIcon from "assets/icons/dashboard/incoming.svg";
import OutgoingIcon from "assets/icons/dashboard/outgoing.svg";
// import CancelledIcon from "assets/icons/dashboard/cancelled.svg";
import AddPeopleIcon from "assets/icons/dashboard/empty/people.svg";

import { RecentTx } from "./styles";
import Img from "components/common/Img";
import { TRANSACTION_STATUS } from "constants/transactions";
import { TX_DIRECTION, TX_ORIGIN } from "store/transactions/constants";
import Loading from "components/common/Loading";
import Avatar from "components/common/Avatar";
import Button from "components/common/Button";
import TokenImg from "components/common/TokenImg";
import { formatNumber } from "utils/number-helpers";
import { routeGenerators } from "constants/routes/generators";
import TransactionName from "components/Transactions/TransactionName";

const transactionsKey = "transactions";

const STATES = {
  EMPTY_STATE: "EMPTY_STATE",
  PEOPLE_ADDED: "PEOPLE_ADDED",
  TRANSACTION_EXECUTED: "TRANSACTION_EXECUTED",
};

function RecentTxCard() {
  const [encryptionKey] = useEncryptionKey();
  const [state, setState] = useState(STATES.EMPTY_STATE);
  const [loading, setLoading] = useState();
  const [transactionData, setTransactionData] = useState();

  useInjectReducer({ key: transactionsKey, reducer: transactionsReducer });
  useInjectReducer({ key: viewPeopleKey, reducer: viewPeopleReducer });

  useInjectSaga({ key: transactionsKey, saga: transactionsSaga });
  useInjectSaga({ key: viewPeopleKey, saga: viewPeopleSaga });

  const dispatch = useDispatch();

  const transactions = useSelector(makeSelectTransactions());
  const loadingTransactions = useSelector(makeSelectLoadingTransactions());
  const loadingPeople = useSelector(makeSelectLoadingPeople());
  const safeAddress = useSelector(makeSelectOwnerSafeAddress());
  const organisationType = useSelector(makeSelectOrganisationType());
  const people = useSelector(makeSelectPeople());

  useEffect(() => {
    if (safeAddress) {
      dispatch(viewTransactions(safeAddress));
      dispatch(getAllPeople(safeAddress));
    }
  }, [dispatch, safeAddress]);

  useEffect(() => {
    if (!loadingTransactions && !loadingPeople) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [loadingPeople, loadingTransactions]);

  useEffect(() => {
    if (people && people.length > 0 && state !== STATES.TRANSACTION_EXECUTED) {
      setState(STATES.PEOPLE_ADDED);
    } else if (state !== STATES.TRANSACTION_EXECUTED) {
      setState(STATES.EMPTY_STATE);
    }
  }, [people, state]);

  useEffect(() => {
    if (transactions && transactions.length > 0) {
      setState(STATES.TRANSACTION_EXECUTED);
      setTransactionData(transactions.slice(0, 3));
    } else {
      setState(STATES.EMPTY_STATE);
    }
  }, [transactions]);

  const stepTitle = useMemo(() => {
    switch (state) {
      case STATES.EMPTY_STATE:
        return `Add People`;
      case STATES.PEOPLE_ADDED:
        return `Recently Added People`;
      case STATES.TRANSACTION_EXECUTED:
        return `Recent Transactions`;
      default:
        return null;
    }
  }, [state]);

  const linkByState = useMemo(() => {
    switch (state) {
      case STATES.EMPTY_STATE:
        return null;
      case STATES.PEOPLE_ADDED:
        return routeGenerators.dashboard.people({ safeAddress });
      case STATES.TRANSACTION_EXECUTED:
        return routeGenerators.dashboard.transactions({ safeAddress });
      default:
        return null;
    }
  }, [state, safeAddress]);

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

  const renderGnosisAmounts = ({
    tokenValue,
    tokenCurrencies,
    fiatValue,
    direction,
  }) => {
    return (
      <div className="tx-amounts">
        {tokenCurrencies && tokenCurrencies.length > 0 && tokenValue > 0 && (
          <div className="top">
            {formatNumber(tokenValue, 5)} {tokenCurrencies.split(", ")}
          </div>
        )}
        {fiatValue > 0 && (
          <div className="bottom">
            {direction === TX_DIRECTION.INCOMING ? "+" : "-"} $
            {formatNumber(fiatValue, 5)}
          </div>
        )}
      </div>
    );
  };

  const renderCoinshiftAmounts = ({
    tokenValue,
    tokenCurrency,
    fiatValue,
    direction,
  }) => {
    return (
      <div className="tx-amounts">
        <div className="top">
          {formatNumber(tokenValue, 5)} {tokenCurrency}
        </div>
        <div className="bottom">
          {direction === TX_DIRECTION.INCOMING ? "+" : "-"} $
          {formatNumber(fiatValue, 5)}
        </div>
      </div>
    );
  };

  const renderTx = ({ direction, txDetails, txOrigin }) => {
    if (!txDetails) return null;
    const {
      createdOn,
      // fiatCurrency,
      fiatValue,
      tokenCurrencies,
      tokenCurrency,
      tokenValue,
      transactionMode,
      transactionId,
      to,
      status,
    } = txDetails;
    const isGnosisTx = txOrigin === TX_ORIGIN.GNOSIS;
    return (
      <Link
        to={routeGenerators.dashboard.transactionById({
          safeAddress,
          transactionId,
        })}
        className="tx"
        key={transactionId}
      >
        <div className="tx-info">
          <Img
            src={
              direction === TX_DIRECTION.INCOMING ? IncomingIcon : OutgoingIcon
            }
            alt="tx-icon"
            className="mr-4"
          />
          <div>
            <div className="top">
              {isGnosisTx ? (
                <span>Gnosis</span>
              ) : (
                <TransactionName to={to} transactionMode={transactionMode} />
              )}
            </div>
            <div className="bottom">
              {createdOn && format(new Date(createdOn), "dd MMM yyyy")}
            </div>
          </div>
        </div>
        {isGnosisTx
          ? renderGnosisAmounts({
              tokenValue,
              tokenCurrencies,
              fiatValue,
              direction,
            })
          : renderCoinshiftAmounts({
              tokenValue,
              tokenCurrency,
              fiatValue,
              direction,
            })}
        <div className="tx-status">{renderStatusText(status)}</div>
      </Link>
    );
  };
  return (
    <RecentTx>
      <div className="title-container">
        <div className="title">{stepTitle}</div>
        {linkByState && (
          <Link to={linkByState} className="view">
            View All
          </Link>
        )}
      </div>
      {loading && (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ height: "30rem" }}
        >
          <Loading color="primary" width="3rem" height="3rem" />
        </div>
      )}
      {!loading && state === STATES.TRANSACTION_EXECUTED && (
        <div className="tx-container">
          {transactionData && transactionData.map((tx) => renderTx(tx))}
        </div>
      )}

      {!loading && state === STATES.EMPTY_STATE && (
        <div className="add-people-container">
          <Img src={AddPeopleIcon} alt="add-people" />
          <div className="text mt-4">Start by adding people and teams</div>
          <Button
            to={routeGenerators.dashboard.people({ safeAddress })}
            width="16rem"
            className="mt-4"
          >
            Add People
          </Button>
        </div>
      )}

      {!loading &&
        state === STATES.PEOPLE_ADDED &&
        people &&
        people.slice(0, 3).map((teammate) => {
          const { firstName, lastName, salaryAmount, salaryToken } =
            getDecryptedDetails(teammate.data, encryptionKey, organisationType);
          return (
            <div key={teammate.data} className="view-people-container">
              <div className="d-flex align-items-center">
                <Avatar
                  firstName={firstName}
                  lastName={lastName}
                  className="mr-3"
                />
                <div className="name">
                  {firstName} {lastName}
                </div>
              </div>
              <div className="name">
                <TokenImg token={salaryToken} /> {formatNumber(salaryAmount, 5)}{" "}
                {salaryToken}
              </div>
              <div className="team">{teammate.departmentName}</div>
            </div>
          );
        })}
    </RecentTx>
  );
}

export default memo(RecentTxCard);
