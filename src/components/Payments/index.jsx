import React, { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLongArrowAltLeft,
  faLongArrowAltRight,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import { cryptoUtils } from "parcel-sdk";
import { show } from "redux-modal";
import { useHistory } from "react-router-dom";

import { Info } from "components/Dashboard-old/styles";
import { Card } from "components/common/Card";
import Button from "components/common/Button";
import viewTeamsReducer from "store/view-teams/reducer";
import { getTeams } from "store/view-teams/actions";
import viewTeamsSaga from "store/view-teams/saga";
import viewPeopleSaga from "store/view-people/saga";
import viewPeopleReducer from "store/view-people/reducer";
import { getAllPeople, getPeopleByDepartment } from "store/view-people/actions";
import {
  makeSelectTeams,
  makeSelectLoading as makeSelectTeamsLoading,
} from "store/view-teams/selectors";
import {
  makeSelectPeople,
  makeSelectLoading as makeSelectPeopleLoading,
} from "store/view-people/selectors";
import transactionsReducer from "store/transactions/reducer";
import transactionsSaga from "store/transactions/saga";
import {
  makeSelectMetaTransactionHash,
  makeSelectError as makeSelectErrorInCreateTx,
  makeSelectTransactionId as makeSelectSingleOwnerTransactionId,
} from "store/transactions/selectors";
import {
  addTransaction,
  clearTransactionHash,
} from "store/transactions/actions";
import safeReducer from "store/safe/reducer";
import safeSaga from "store/safe/saga";
import invitationSaga from "store/invitation/saga";
import invitationReducer from "store/invitation/reducer";
import { getInvitations } from "store/invitation/actions";
import { getNonce } from "store/safe/actions";
import {
  makeSelectNonce,
  makeSelectLoading as makeSelectLoadingSafeDetails,
} from "store/safe/selectors";
import { createMultisigTransaction } from "store/multisig/actions";
import multisigSaga from "store/multisig/saga";
import multisigReducer from "store/multisig/reducer";
import { makeSelectUpdating as makeSelectAddTxLoading } from "store/multisig/selectors";
import metaTxReducer from "store/metatx/reducer";
import metaTxSaga from "store/metatx/saga";
import { getMetaTxEnabled } from "store/metatx/actions";
import { makeSelectIsMetaTxEnabled } from "store/metatx/selectors";
import { getTokens } from "store/tokens/actions";
import {
  makeSelectLoading as makeSelectLoadingTokens,
  makeSelectTokenList,
  makeSelectPrices,
  makeSelectTokenIcons,
} from "store/tokens/selectors";
import tokensSaga from "store/tokens/saga";
import tokensReducer from "store/tokens/reducer";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import { useActiveWeb3React, useLocalStorage, useMassPayout } from "hooks";
import {
  makeSelectOwnerSafeAddress,
  makeSelectThreshold,
  makeSelectIsMultiOwner,
  makeSelectOrganisationType,
} from "store/global/selectors";
import { minifyAddress } from "components/common/Web3Utils";
import Loading from "components/common/Loading";
import TeamPng from "assets/images/user-team.png";

import { getDefaultIconIfPossible, defaultTokenDetails } from "constants/index";
import { Container, Table, PaymentSummary, TokenBalance } from "./styles";
import TransactionSubmitted from "./TransactionSubmitted";
import SelectTokenModal, {
  MODAL_NAME as SELECT_TOKEN_MODAL,
} from "./SelectTokenModal";
import { TRANSACTION_MODES } from "constants/transactions";
import { formatNumber } from "utils/number-helpers";

const { TableBody, TableHead, TableRow } = Table;

// reducer/saga keys
const viewPeopleKey = "viewPeople";
const viewTeamsKey = "viewTeams";
const transactionsKey = "transactions";
const safeKey = "safe";
const multisigKey = "multisig";
const tokensKey = "tokens";
const invitationKey = "invitation";
const metaTxKey = "metatx";

const TABS = {
  PEOPLE: "1",
  DEPARTMENT: "2",
};

const navStyles = `
  .nav-tabs {
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.05);
    border-bottom: solid 1px #f2f2f2;
    background-color: #ffffff;
  }

  .nav-link {
    font-size: 20px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.2;
    letter-spacing: normal;
    text-align: left;
    color: #aaaaaa;
    cursor: pointer;
    opacity: 0.4;
    padding-bottom: 15px;
    padding-top: 15px;
  }

  .nav-tabs .nav-item.show .nav-link, .nav-tabs .nav-link.active {
    border-bottom: 5px solid #7367f0;
  }

  .nav-tabs .nav-link:focus, .nav-tabs .nav-link:hover {
    border: none;
    border-bottom: 5px solid #7367f0;
    opacity: 1;
  }

  .nav-link.active {
    opacity: 1;
    border: none;
    font-size: 20px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.2;
    letter-spacing: normal;
    text-align: left;
    color: #373737;
  }
`;

export default function Payments() {
  const [encryptionKey] = useLocalStorage("ENCRYPTION_KEY");

  const { account } = useActiveWeb3React();

  const [checked, setChecked] = useState([]);
  const [isCheckedAll, setIsCheckedAll] = useState(false);
  const [activeTab, setActiveTab] = useState(TABS.PEOPLE);
  // const [loadingTx, setLoadingTx] = useState(false);
  // const [txHash, setTxHash] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [departmentStep, setDepartmentStep] = useState(0);
  const [metaTxHash, setMetaTxHash] = useState();
  const [submittedTx, setSubmittedTx] = useState(false);
  const [selectedTokenName, setSelectedTokenName] = useState();
  const [selectedTokenDetails, setSelectedTokenDetails] = useState();
  const [tokenDetails, setTokenDetails] = useState(defaultTokenDetails);
  const {
    loadingTx,
    txHash,
    recievers,
    massPayout,
    txData,
    setTxData,
  } = useMassPayout({ tokenDetails: selectedTokenDetails });

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  // Reducers
  useInjectReducer({ key: viewPeopleKey, reducer: viewPeopleReducer });
  useInjectReducer({
    key: viewTeamsKey,
    reducer: viewTeamsReducer,
  });
  useInjectReducer({ key: transactionsKey, reducer: transactionsReducer });
  useInjectReducer({ key: safeKey, reducer: safeReducer });
  useInjectReducer({ key: multisigKey, reducer: multisigReducer });
  useInjectReducer({ key: tokensKey, reducer: tokensReducer });
  useInjectReducer({ key: invitationKey, reducer: invitationReducer });
  useInjectReducer({ key: metaTxKey, reducer: metaTxReducer });

  // Sagas
  useInjectSaga({ key: viewPeopleKey, saga: viewPeopleSaga });
  useInjectSaga({ key: viewTeamsKey, saga: viewTeamsSaga });
  useInjectSaga({ key: transactionsKey, saga: transactionsSaga });
  useInjectSaga({ key: safeKey, saga: safeSaga });
  useInjectSaga({ key: multisigKey, saga: multisigSaga });
  useInjectSaga({ key: tokensKey, saga: tokensSaga });
  useInjectSaga({ key: invitationKey, saga: invitationSaga });
  useInjectSaga({ key: metaTxKey, saga: metaTxSaga });

  const dispatch = useDispatch();
  const history = useHistory();

  // Selectors
  const allDepartments = useSelector(makeSelectTeams());
  const loadingDepartments = useSelector(makeSelectTeamsLoading());
  const loadingTeammates = useSelector(makeSelectPeopleLoading());
  const teammates = useSelector(makeSelectPeople());
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());
  const prices = useSelector(makeSelectPrices());
  const txHashFromMetaTx = useSelector(makeSelectMetaTransactionHash());
  const errorFromMetaTx = useSelector(makeSelectErrorInCreateTx());
  const addingTx = useSelector(makeSelectAddTxLoading());
  const nonce = useSelector(makeSelectNonce());
  const threshold = useSelector(makeSelectThreshold());
  const isMultiOwner = useSelector(makeSelectIsMultiOwner());
  const loadingSafeDetails = useSelector(makeSelectLoadingSafeDetails());
  const tokenList = useSelector(makeSelectTokenList());
  const loadingTokens = useSelector(makeSelectLoadingTokens());
  const icons = useSelector(makeSelectTokenIcons());
  const singleOwnerTransactionId = useSelector(
    makeSelectSingleOwnerTransactionId()
  );
  const organisationType = useSelector(makeSelectOrganisationType());
  const isMetaEnabled = useSelector(makeSelectIsMetaTxEnabled());

  useEffect(() => {
    if (txHashFromMetaTx) {
      setMetaTxHash(txHashFromMetaTx);
      dispatch(clearTransactionHash());
    }
  }, [dispatch, txHashFromMetaTx]);

  useEffect(() => {
    if (ownerSafeAddress) {
      dispatch(getInvitations(ownerSafeAddress));
      dispatch(getNonce(ownerSafeAddress));
      dispatch(getMetaTxEnabled(ownerSafeAddress));
    }
  }, [ownerSafeAddress, dispatch]);

  useEffect(() => {
    if (ownerSafeAddress && !icons) {
      dispatch(getTokens(ownerSafeAddress));
    }
  }, [ownerSafeAddress, dispatch, icons]);

  // useEffect(() => {
  //   setSelectedTokenDetails(
  //     tokenDetails.filter(({ name }) => name === tokens.DAI)[0]
  //   );
  // }, [tokenDetails]);

  useEffect(() => {
    if (tokenList && tokenList.length > 0) {
      setTokenDetails(tokenList);
      setSelectedTokenName(tokenList[0].name);
    }
  }, [tokenList]);

  useEffect(() => {
    if (selectedTokenName)
      setSelectedTokenDetails(
        tokenDetails.filter(({ name }) => name === selectedTokenName)[0]
      );
  }, [tokenDetails, selectedTokenName]);

  useEffect(() => {
    // reset to initial state
    setSelectedRows([]);
    setChecked([]);
    setIsCheckedAll(false);
    if (activeTab === TABS.PEOPLE) {
      dispatch(getAllPeople(ownerSafeAddress));
    } else {
      setDepartmentStep(0);
      dispatch(getTeams(ownerSafeAddress));
    }
  }, [dispatch, ownerSafeAddress, activeTab]);

  useEffect(() => {
    if (teammates && teammates.length > 0) {
      setChecked(new Array(teammates.length).fill(false));
    }
  }, [teammates]);

  const totalAmountToPay = useMemo(() => {
    if (prices) {
      return selectedRows.reduce(
        (total, { salaryAmount, salaryToken }) =>
          (total += prices[salaryToken] * salaryAmount),
        0
      );
    }

    return selectedRows.reduce(
      (total, { salaryAmount }) => (total += Number(salaryAmount)),
      0
    );
  }, [prices, selectedRows]);

  const isMassPayoutAllowed = useMemo(() => {
    const hashmap = selectedRows.reduce((hashmap, token) => {
      if (!hashmap[token.salaryToken]) {
        hashmap[token.salaryToken] = true;
      }
      return hashmap;
    }, {});

    return selectedTokenDetails &&
      Object.keys(hashmap).length === 1 &&
      hashmap[selectedTokenDetails.name]
      ? true
      : false;
  }, [selectedRows, selectedTokenDetails]);

  useEffect(() => {
    if (txHash) {
      setSubmittedTx(true);
      if (
        encryptionKey &&
        recievers &&
        ownerSafeAddress &&
        totalAmountToPay &&
        selectedTokenDetails &&
        account
      ) {
        const to = cryptoUtils.encryptDataUsingEncryptionKey(
          JSON.stringify(recievers),
          encryptionKey,
          organisationType
        );
        // const to = selectedTeammates;

        dispatch(
          addTransaction({
            to,
            safeAddress: ownerSafeAddress,
            createdBy: account,
            transactionHash: txHash,
            tokenValue: recievers.reduce(
              (total, { salaryAmount }) => (total += parseFloat(salaryAmount)),
              0
            ),
            tokenCurrency: selectedTokenDetails.name,
            fiatValue: parseFloat(totalAmountToPay).toFixed(5),
            addresses: recievers.map(({ address }) => address),
          })
        );
      }
    } else if (txData) {
      if (
        encryptionKey &&
        recievers &&
        ownerSafeAddress &&
        totalAmountToPay &&
        selectedTokenDetails &&
        account
      ) {
        const to = cryptoUtils.encryptDataUsingEncryptionKey(
          JSON.stringify(recievers),
          encryptionKey,
          organisationType
        );
        if (!isMultiOwner) {
          // threshold = 1 or single owner
          dispatch(
            addTransaction({
              to,
              safeAddress: ownerSafeAddress,
              createdBy: account,
              txData,
              tokenValue: recievers.reduce(
                (total, { salaryAmount }) =>
                  (total += parseFloat(salaryAmount)),
                0
              ),
              tokenCurrency: selectedTokenDetails.name,
              fiatValue: parseFloat(totalAmountToPay).toFixed(5),
              addresses: recievers.map(({ address }) => address),
            })
          );
          setTxData(undefined);
        } else {
          // threshold > 1
          dispatch(
            createMultisigTransaction({
              to,
              safeAddress: ownerSafeAddress,
              createdBy: account,
              txData,
              tokenValue: recievers.reduce(
                (total, { salaryAmount }) =>
                  (total += parseFloat(salaryAmount)),
                0
              ),
              tokenCurrency: selectedTokenDetails.name,
              fiatValue: totalAmountToPay,
              fiatCurrency: "USD",
              addresses: recievers.map(({ address }) => address),
              nonce: nonce,
              transactionMode: TRANSACTION_MODES.MASS_PAYOUT,
            })
          );
        }
      }
    }
  }, [
    txHash,
    encryptionKey,
    recievers,
    dispatch,
    ownerSafeAddress,
    totalAmountToPay,
    selectedTokenDetails,
    txData,
    setTxData,
    account,
    isMultiOwner,
    nonce,
    history,
    prices,
    organisationType,
  ]);

  const isNoneChecked = useMemo(() => checked.every((check) => !check), [
    checked,
  ]);

  const getDecryptedDetails = (data) => {
    if (!encryptionKey) return "";
    return JSON.parse(
      cryptoUtils.decryptDataUsingEncryptionKey(
        data,
        encryptionKey,
        organisationType
      )
    );
  };

  const handleMassPayout = async (selectedTeammates) => {
    await massPayout(
      selectedTeammates,
      selectedTokenDetails.name,
      isMultiOwner,
      nonce,
      isMetaEnabled
    );
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log({ selectedRows });

    await handleMassPayout(selectedRows);
  };

  const handleCheckAll = (e) => {
    if (checked.every((check) => check)) {
      // deselect all
      setChecked(new Array(checked.length).fill(false));
      setIsCheckedAll(false);
      setSelectedRows([]);
    } else {
      // select all
      setChecked(new Array(checked.length).fill(true));
      setIsCheckedAll(true);
      if (teammates && teammates.length > 0) {
        const allRows = teammates.map(({ data }) => getDecryptedDetails(data));
        setSelectedRows(allRows);
      }
    }
  };

  const handleChecked = (e, teammateDetails, index) => {
    const newChecked = [...checked];
    newChecked[index] = !checked[index];
    setChecked(newChecked);
    // if checked, push the details, provided it doesn't already exist in the array
    // else remove the unselected details from the array
    if (
      e.target.checked &&
      !selectedRows.some((row) => row.address === teammateDetails.address)
    ) {
      setSelectedRows([...selectedRows, teammateDetails]);
    } else {
      setSelectedRows(
        selectedRows.filter((row) => row.address !== teammateDetails.address)
      );
    }
  };

  const handleSelectDepartment = (departmentId) => {
    if (ownerSafeAddress && departmentId) {
      dispatch(getPeopleByDepartment(ownerSafeAddress, departmentId));
      setDepartmentStep(departmentStep + 1);
      setSelectedRows([]);
    }
  };

  const goBackToDepartments = () => {
    setDepartmentStep(departmentStep - 1);
  };

  const getSelectedCount = () => {
    return checked.filter(Boolean).length;
  };

  const showTokenModal = () => {
    dispatch(
      show(SELECT_TOKEN_MODAL, {
        selectedTokenDetails,
        setSelectedTokenDetails,
      })
    );
  };

  const renderPayTable = () => {
    if (!teammates.length)
      return (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ height: "400px" }}
        >
          No Teammates Found!
        </div>
      );

    return (
      <div>
        <TableHead>
          <div className="form-check d-flex">
            <input
              className="form-check-input position-static mr-3"
              type="checkbox"
              id="allCheckbox"
              checked={isCheckedAll}
              onChange={handleCheckAll}
            />
            <div>Teammate Name</div>
          </div>
          <div>Team</div>
          {/* <div>Pay Token</div> */}
          <div>Pay Amount</div>
          <div>Address</div>
          <div></div>
        </TableHead>
        <TableBody>
          {teammates.length > 0 &&
            teammates.map(({ data, departmentName }, idx) => {
              const {
                firstName,
                lastName,
                salaryAmount,
                salaryToken,
                address,
              } = getDecryptedDetails(data);
              return (
                <TableRow key={`${address}-${idx}`}>
                  <div className="form-check d-flex">
                    <input
                      className="form-check-input position-static mr-3"
                      type="checkbox"
                      id={`checkbox${idx}`}
                      name={`checkbox${idx}`}
                      checked={checked[idx] || false}
                      onChange={(e) => {
                        const teammateDetails = {
                          firstName,
                          lastName,
                          salaryToken,
                          salaryAmount,
                          address,
                        };
                        handleChecked(e, teammateDetails, idx);
                      }}
                    />
                    <div>
                      {firstName} {lastName}
                    </div>
                  </div>
                  <div>{departmentName}</div>
                  {/* <div>{salaryToken}</div> */}
                  <div>
                    <img
                      src={getDefaultIconIfPossible(salaryToken, icons)}
                      alt={salaryToken}
                      width="16"
                    />{" "}
                    {salaryAmount} {salaryToken}{" "}
                    {prices &&
                      prices[salaryToken] !== undefined &&
                      `(US$
                       ${parseFloat(prices[salaryToken] * salaryAmount).toFixed(
                         2
                       )})`}
                  </div>
                  <div>{minifyAddress(address)}</div>
                  <div className="text-right">
                    {checked.filter(Boolean).length <= 1 && (
                      <Button
                        type="submit"
                        iconOnly
                        disabled={
                          !checked[idx] ||
                          loadingTx ||
                          isNoneChecked ||
                          !isMassPayoutAllowed
                        }
                        className="py-0"
                      >
                        <span className="pay-text">PAY</span>
                      </Button>
                    )}
                  </div>
                </TableRow>
              );
            })}
        </TableBody>
      </div>
    );
  };

  const renderDepartments = () => {
    if (!allDepartments || !allDepartments.length) {
      return (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ height: "400px" }}
        >
          No Teams Found!
        </div>
      );
    }
    return (
      <div className="department-cards">
        {allDepartments &&
          allDepartments.map(({ departmentId, name, employees }) => (
            <Card
              className="department-card mb-4"
              key={departmentId}
              onClick={() => handleSelectDepartment(departmentId)}
            >
              <div className="upper">
                <div className="d-flex justify-content-between">
                  <img src={TeamPng} alt={name} width="50" />
                  <div className="circle circle-grey">
                    <FontAwesomeIcon
                      icon={faLongArrowAltRight}
                      color="#7367f0"
                    />
                  </div>
                </div>
                <div className="mt-2">{name}</div>
              </div>

              <div className="line" />
              <div className="lower">
                <div className="mb-3">Teammates : {employees}</div>
              </div>
            </Card>
          ))}
      </div>
    );
  };

  const renderPaymentSummary = () => {
    const insufficientBalance =
      selectedTokenDetails.usd - totalAmountToPay > 0 ? false : true;
    return (
      <PaymentSummary>
        <div className="payment-info">
          <div>
            <div className="payment-title">Total Selected</div>
            <div className="payment-subtitle">{getSelectedCount()} people</div>
          </div>
          <div>
            <div className="payment-title">Total Amount</div>
            {!isNaN(totalAmountToPay) ? (
              <div className="payment-subtitle">
                US$ {formatNumber(totalAmountToPay)}
              </div>
            ) : (
              0
            )}
          </div>
          <div>
            <div className="payment-title">Balance after payment</div>
            <div className="payment-subtitle">
              {!insufficientBalance
                ? `US$ ${formatNumber(
                    selectedTokenDetails.usd - totalAmountToPay
                  )}`
                : `Insufficient Balance`}
            </div>
          </div>
        </div>

        <div className="pay-button">
          <Button
            type="submit"
            large
            loading={loadingTx || addingTx}
            disabled={
              loadingTx ||
              insufficientBalance ||
              addingTx ||
              !isMassPayoutAllowed ||
              loadingSafeDetails ||
              loadingTokens
            }
          >
            {threshold > 1 ? `Create Transaction` : `Pay Now`}
          </Button>
        </div>
      </PaymentSummary>
    );
  };

  return !metaTxHash && !submittedTx ? (
    <div
      style={{
        transition: "all 0.25s linear",
      }}
    >
      <div>
        <Info>
          <div
            style={{
              maxWidth: "1200px",
              transition: "all 0.25s linear",
            }}
            className="mx-auto"
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="title">Payments</div>
                <div className="subtitle">
                  One click mass payouts to teams and people
                </div>
              </div>
              {!selectedTokenDetails && (
                <TokenBalance>
                  <div className="d-flex align-items-center justify-content-center">
                    <Loading color="primary" width="50px" height="50px" />
                  </div>
                </TokenBalance>
              )}
              {selectedTokenDetails && (
                <TokenBalance onClick={showTokenModal}>
                  <div className="token-icon">
                    <img
                      src={selectedTokenDetails.icon}
                      alt="token"
                      width="45"
                    />
                  </div>
                  <div className="balance-info">
                    <div className="balance-text">
                      Paying from {selectedTokenDetails.name}
                    </div>
                    <div className="balance-value">
                      {formatNumber(selectedTokenDetails.balance)}{" "}
                      {selectedTokenDetails.name} (US$
                      {formatNumber(selectedTokenDetails.usd)})
                    </div>
                  </div>
                  <div className="separator"></div>
                  <div className="change-text">CHANGE</div>
                </TokenBalance>
              )}
              <SelectTokenModal />
            </div>
          </div>
        </Info>
        <Container
          style={{
            maxWidth: "1200px",
            transition: "all 0.25s linear",
          }}
        >
          <form onSubmit={onSubmit}>
            <style>{navStyles}</style>
            <Card style={{ minHeight: "532px" }} className="pt-3">
              <Nav tabs>
                <NavItem className="px-3">
                  <NavLink
                    className={`${activeTab === TABS.PEOPLE ? "active" : ""}`}
                    onClick={() => toggle(TABS.PEOPLE)}
                  >
                    People
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={`${
                      activeTab === TABS.DEPARTMENT ? "active" : ""
                    }`}
                    onClick={() => toggle(TABS.DEPARTMENT)}
                  >
                    Teams
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={activeTab}>
                <TabPane tabId={TABS.PEOPLE}>
                  {loadingTeammates && (
                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{ height: "400px" }}
                    >
                      <Loading color="primary" width="50px" height="50px" />
                    </div>
                  )}
                  {!loadingTeammates && teammates && renderPayTable()}
                </TabPane>
                <TabPane tabId={TABS.DEPARTMENT}>
                  {(loadingDepartments || loadingTeammates) && (
                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{ height: "400px" }}
                    >
                      <Loading color="primary" width="50px" height="50px" />
                    </div>
                  )}

                  {!loadingTeammates &&
                    !loadingDepartments &&
                    (departmentStep === 0 ? (
                      renderDepartments()
                    ) : (
                      <div>
                        <Button iconOnly onClick={goBackToDepartments}>
                          <div className="circle">
                            <FontAwesomeIcon
                              icon={faLongArrowAltLeft}
                              color="#fff"
                            />
                          </div>
                        </Button>
                        {teammates && renderPayTable()}
                      </div>
                    ))}
                </TabPane>
              </TabContent>

              {!isNoneChecked && renderPaymentSummary()}
            </Card>
            <div style={{ minHeight: "20vh" }}>
              {!isNoneChecked && !isMassPayoutAllowed && (
                <div className="text-danger mt-3">
                  Please make sure all the teammate's token match your selected
                  token
                </div>
              )}
              {/* {!isNoneChecked && !isSetupComplete && (
                <div className="mt-3">
                  Please <Link to="/dashboard/invite">complete your setup</Link>{" "}
                  before creating a transaction
                </div>
              )} */}
              {!loadingTx && errorFromMetaTx && (
                <div className="text-danger mt-3">{errorFromMetaTx}</div>
              )}
            </div>
          </form>
        </Container>
      </div>
    </div>
  ) : (
    <TransactionSubmitted
      txHash={txHash ? txHash : metaTxHash}
      selectedCount={getSelectedCount()}
      transactionId={singleOwnerTransactionId}
    />
  );
}
