import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cryptoUtils } from "parcel-sdk";
// import { show } from "redux-modal";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";

import Button from "components/common/Button";
import viewTeamsReducer from "store/view-teams/reducer";
import { getTeams } from "store/view-teams/actions";
import viewTeamsSaga from "store/view-teams/saga";
import viewPeopleSaga from "store/view-people/saga";
import viewPeopleReducer from "store/view-people/reducer";
import { getPeopleByTeam } from "store/view-people/actions";
import {
  makeSelectTeams,
  makeSelectLoading as makeSelectTeamsLoading,
  makeSelectTeamIdToDetailsMap,
} from "store/view-teams/selectors";
import {
  makeSelectLoading as makeSelectPeopleLoading,
  makeSelectPeopleByTeam,
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
import Loading from "components/common/Loading";
import {
  Table,
  TableHead,
  TableBody,
  TableInfo,
} from "components/common/Table";

import { defaultTokenDetails } from "constants/index";
import { MassPayoutContainer, PaymentSummary } from "./styles";
import TransactionSubmitted from "./TransactionSubmitted";
import { TRANSACTION_MODES } from "constants/transactions";
import { formatNumber } from "utils/number-helpers";
import TokenImg from "components/common/TokenImg";
import { getDecryptedDetails } from "utils/encryption";
import { Input, Select, SelectToken } from "components/common/Form";
import { constructLabel } from "utils/tokens";
import CheckBox from "components/common/CheckBox";

// reducer/saga keys
const viewPeopleKey = "viewPeople";
const viewTeamsKey = "viewTeams";
const transactionsKey = "transactions";
const safeKey = "safe";
const multisigKey = "multisig";
const tokensKey = "tokens";
const invitationKey = "invitation";
const metaTxKey = "metatx";

export default function Payments() {
  const [encryptionKey] = useLocalStorage("ENCRYPTION_KEY");
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    watch,
  } = useForm({
    mode: "onChange",
  });

  const hasTeamChanged = watch("team");
  const selectedTeamId = getValues()["team"] && getValues()["team"].value;
  const selectedToken = getValues()["token"] && getValues()["token"].value;

  const { account } = useActiveWeb3React();

  const [checked, setChecked] = useState([]);
  const [isCheckedAll, setIsCheckedAll] = useState(false);
  const [people, setPeople] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [metaTxHash, setMetaTxHash] = useState();
  const [submittedTx, setSubmittedTx] = useState(false);
  const [selectedTokenDetails, setSelectedTokenDetails] = useState();
  const [isSelectedTokenUSD, setIsSelectedTokenUSD] = useState();
  const [existingTokenDetails, setExistingTokenDetails] = useState(
    defaultTokenDetails
  );
  const [tokensDropdown, setTokensDropdown] = useState([]);
  const [teamsDropdown, setTeamsDropdown] = useState();
  const [selectedTokenName, setSelectedTokenName] = useState();
  const {
    loadingTx,
    txHash,
    recievers,
    massPayout,
    txData,
    setTxData,
  } = useMassPayout({ tokenDetails: selectedTokenDetails });

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
  const allTeams = useSelector(makeSelectTeams());
  const loadingTeams = useSelector(makeSelectTeamsLoading());
  const loadingTeammates = useSelector(makeSelectPeopleLoading());
  const teammates = useSelector(makeSelectPeopleByTeam());
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
  const singleOwnerTransactionId = useSelector(
    makeSelectSingleOwnerTransactionId()
  );
  const organisationType = useSelector(makeSelectOrganisationType());
  const isMetaEnabled = useSelector(makeSelectIsMetaTxEnabled());
  const teamIdToDetailsMap = useSelector(makeSelectTeamIdToDetailsMap());

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
    if (ownerSafeAddress && (!tokenList || !tokenList.length)) {
      dispatch(getTokens(ownerSafeAddress));
    }
  }, [ownerSafeAddress, dispatch, tokenList]);

  useEffect(() => {
    let dropdownList = [];
    if (allTeams && allTeams.length > 0 && !teamsDropdown) {
      dropdownList = allTeams.map(({ departmentId, name }) => ({
        value: departmentId,
        label: name,
      }));
      setTeamsDropdown(dropdownList);
    }
  }, [allTeams, existingTokenDetails, teamIdToDetailsMap, teamsDropdown]);

  useEffect(() => {
    if (
      hasTeamChanged &&
      selectedTeamId &&
      teamIdToDetailsMap[selectedTeamId]
    ) {
      const { tokenInfo } = teamIdToDetailsMap[selectedTeamId];
      const existingToken = existingTokenDetails.filter(
        ({ name }) => name === tokenInfo.symbol
      )[0];

      if (tokenInfo && tokenInfo.symbol === "USD") {
        setIsSelectedTokenUSD(true);
      } else {
        setIsSelectedTokenUSD(false);
      }

      if (existingToken) {
        setValue("token", {
          value: existingToken.name,
          label: constructLabel({
            token: existingToken.name,
            component: (
              <div>
                {formatNumber(existingToken.balance)} {existingToken.name}
              </div>
            ),
            imgUrl: existingToken.icon,
          }),
        });
      }
    }
  }, [
    teamsDropdown,
    existingTokenDetails,
    teamIdToDetailsMap,
    hasTeamChanged,
    selectedTeamId,
    setValue,
  ]);

  useEffect(() => {
    if (hasTeamChanged && selectedTeamId) {
      dispatch(getPeopleByTeam(ownerSafeAddress, selectedTeamId));
    }
  }, [hasTeamChanged, selectedTeamId, dispatch, ownerSafeAddress]);

  useEffect(() => {
    if (tokenList && tokenList.length > 0 && !tokensDropdown.length) {
      setExistingTokenDetails(tokenList);
      setTokensDropdown(
        tokenList.map((details) => ({
          value: details.name,
          label: constructLabel({
            token: details.name,
            component: (
              <div>
                {formatNumber(details.balance)} {details.name}
              </div>
            ),
            imgUrl: details.icon,
          }),
        }))
      );
    }
  }, [tokenList, tokensDropdown]);

  useEffect(() => {
    // reset to initial state
    setSelectedRows([]);
    setChecked([]);
    setIsCheckedAll(false);
    if (!allTeams) {
      dispatch(getTeams(ownerSafeAddress));
    }
  }, [dispatch, ownerSafeAddress, allTeams]);

  useEffect(() => {
    // reset to initial state
    setSelectedRows([]);
    setChecked([]);
    setIsCheckedAll(false);
  }, [selectedTokenName]);

  useEffect(() => {
    if (people && people.length > 0) {
      setChecked(new Array(people.length).fill(false));
    }
  }, [people]);

  useEffect(() => {
    if (selectedTeamId && teammates) {
      setPeople(teammates);
    } else {
      setPeople();
    }
  }, [selectedTeamId, teammates]);

  useEffect(() => {
    if (selectedToken && existingTokenDetails) {
      setSelectedTokenDetails(
        existingTokenDetails.filter(({ name }) => name === selectedToken)[0]
      );
    }
  }, [selectedToken, existingTokenDetails]);

  const totalAmountToPay = useMemo(() => {
    if (prices) {
      return selectedRows.reduce((total, { salaryAmount, salaryToken }) => {
        if (salaryToken === "USD") {
          total += Number(salaryAmount);
        } else {
          total += prices[salaryToken] * salaryAmount;
        }

        return total;
      }, 0);
    }

    return selectedRows.reduce(
      (total, { salaryAmount }) => (total += Number(salaryAmount)),
      0
    );
  }, [prices, selectedRows]);

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

  const handleMassPayout = async (selectedTeammates) => {
    await massPayout(
      selectedTeammates,
      selectedTokenDetails.name,
      isMultiOwner,
      nonce,
      isMetaEnabled
    );
  };

  const onSubmit = async (values) => {
    const selectedTeammates = selectedRows.map(
      ({ address, salaryAmount, salaryToken, ...rest }) => {
        const amount =
          salaryToken === "USD"
            ? String(salaryAmount / selectedTokenDetails.usdConversionRate)
            : salaryAmount;
        return {
          address,
          salaryAmount: amount,
          salaryToken,
          description: values.description || "",
          usd: selectedTokenDetails.usdConversionRate * amount,
          ...rest,
        };
      }
    );

    console.log({ selectedTeammates });

    await handleMassPayout(selectedTeammates);
  };

  const handleCheckAll = (e) => {
    if (checked.length === people.length && checked.every((check) => check)) {
      // if all are checked, deselect all
      setIsCheckedAll(false);
      setSelectedRows([]);
      setChecked([]);
    } else {
      // select all
      setChecked(new Array(people.length).fill(true));
      setIsCheckedAll(true);
      if (people && people.length > 0) {
        const allRows = people.map(({ data, peopleId }) => ({
          peopleId,
          ...getDecryptedDetails(data, encryptionKey, organisationType),
        }));
        setSelectedRows(allRows);
      }
    }
  };

  const handleChecked = (teammateDetails, index) => {
    const newChecked = [...checked];
    newChecked[index] = !checked[index];
    if (
      newChecked.length === people.length &&
      newChecked.every((check) => check)
    ) {
      setIsCheckedAll(true);
    } else {
      setIsCheckedAll(false);
    }
    setChecked(newChecked);
    // if checked, push the details, provided it doesn't already exist in the array
    // else remove the unselected details from the array
    if (
      newChecked[index] &&
      !selectedRows.some((row) => row.peopleId === teammateDetails.peopleId)
    ) {
      setSelectedRows([...selectedRows, teammateDetails]);
    } else {
      setSelectedRows(
        selectedRows.filter((row) => row.peopleId !== teammateDetails.peopleId)
      );
    }
  };

  const getSelectedCount = () => {
    return checked.filter(Boolean).length;
  };

  const renderNoPeopleFound = () => (
    <TableInfo
      style={{
        fontSize: "1.4rem",
        fontWeight: "500",
        textAlign: "center",
        height: "20rem",
      }}
    >
      <td colSpan={4}>No people found!</td>
    </TableInfo>
  );

  const renderLoading = () => (
    <TableInfo
      style={{
        textAlign: "center",
        height: "20rem",
      }}
    >
      <td colSpan={4}>
        <div className="d-flex align-items-center justify-content-center">
          <Loading color="primary" width="3rem" height="3rem" />
        </div>
      </td>
    </TableInfo>
  );

  const renderPayTable = () => {
    if (!people || !selectedToken) return;

    return (
      <div>
        <div className="outer-flex mt-5">
          <div className="title">Team Details</div>

          {!loadingTeammates && people.length > 0 && (
            <div className="select-all">
              <CheckBox
                type="checkbox"
                id="allCheckbox"
                checked={isCheckedAll}
                onChange={handleCheckAll}
                label={`Select All`}
              />
              {/* <div>Select All</div> */}
            </div>
          )}
        </div>
        <div style={{ height: "25rem", overflow: "auto" }}>
          <Table>
            <TableHead>
              <tr>
                <th style={{ width: "30%" }}>Name</th>
                <th style={{ width: "25%" }}>Disbursement</th>
                <th style={{ width: "45%" }}>Address</th>
              </tr>
            </TableHead>
            <TableBody>
              {loadingTeammates && renderLoading()}
              {!loadingTeammates && !people.length && renderNoPeopleFound()}
              {!loadingTeammates &&
                people.length > 0 &&
                people.map(({ peopleId, data, ...rest }, idx) => {
                  const {
                    firstName,
                    lastName,
                    salaryAmount,
                    salaryToken,
                    address,
                  } = getDecryptedDetails(
                    data,
                    encryptionKey,
                    organisationType
                  );

                  const teammateDetails = {
                    firstName,
                    lastName,
                    salaryToken,
                    salaryAmount,
                    address,
                    peopleId,
                    ...rest,
                  };
                  return (
                    <tr
                      key={`${address}-${idx}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleChecked(teammateDetails, idx);
                      }}
                      style={{
                        backgroundColor: checked[idx] ? "#f1f0fd" : "#fff",
                      }}
                    >
                      <td className="d-flex align-items-center">
                        <CheckBox
                          type="checkbox"
                          id={`checkbox${idx}`}
                          name={`checkbox${idx}`}
                          checked={checked[idx] || false}
                        />
                        <div>
                          {firstName} {lastName}
                        </div>
                      </td>
                      <td>
                        <TokenImg token={salaryToken} />
                        <span>
                          {salaryAmount} {salaryToken}{" "}
                        </span>
                      </td>
                      <td>{address}</td>
                    </tr>
                  );
                })}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  const renderPaymentSummary = () => {
    if (!people || !selectedToken || !selectedTokenDetails) return;
    const insufficientBalance =
      selectedTokenDetails.usd - totalAmountToPay > 0 ? false : true;
    return (
      <PaymentSummary>
        <div className="payment-info">
          <div>
            <div className="payment-title">
              Current {selectedTokenDetails.name} Balance
            </div>
            <div className="payment-subtitle">{`US$ ${formatNumber(
              selectedTokenDetails.usd
            )}`}</div>
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
          <div>
            <div className="payment-title">Total Selected</div>
            <div className="payment-subtitle">{getSelectedCount()} people</div>
          </div>
          <div>
            <div className="payment-title">Total Amount</div>
            <div className="payment-subtitle">
              {!isNaN(totalAmountToPay)
                ? `US$ ${formatNumber(totalAmountToPay)}`
                : `0`}
            </div>
          </div>
        </div>

        <div>
          <Button
            type="submit"
            width="20rem"
            loading={loadingTx || addingTx}
            disabled={
              loadingTx ||
              insufficientBalance ||
              addingTx ||
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
    <MassPayoutContainer>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="outer-flex">
            <div className="inner-flex">
              <div className="mr-3">
                <div className="title">Paying To</div>
                <Select
                  name="team"
                  control={control}
                  required={`Team is required`}
                  width="18rem"
                  options={teamsDropdown}
                  isSearchable
                  isLoading={loadingTeams}
                  placeholder={`Select Team...`}
                  defaultValue={null}
                />
              </div>
              {selectedTeamId && (
                <div className="mr-4">
                  <div className="title">Paying From</div>
                  <SelectToken
                    name="token"
                    control={control}
                    required={`Token is required`}
                    width="18rem"
                    options={tokensDropdown}
                    isSearchable
                    isLoading={loadingTeams}
                    placeholder={`Select Currency...`}
                    isDisabled={!isSelectedTokenUSD}
                    defaultValue={null}
                    handleChange={(event) => {
                      setSelectedTokenName(event.value);
                    }}
                  />
                </div>
              )}
            </div>
            <div>
              <div className="title">Description</div>
              <Input
                type="text"
                name="description"
                style={{ width: "30rem" }}
                register={register}
                placeholder="Enter description"
              />
            </div>
          </div>

          {renderPayTable()}

          <div>
            {!loadingTx && errorFromMetaTx && (
              <div className="text-danger mt-3">{errorFromMetaTx}</div>
            )}
          </div>
          {renderPaymentSummary()}
        </form>
      </div>
    </MassPayoutContainer>
  ) : (
    <TransactionSubmitted
      txHash={txHash ? txHash : metaTxHash}
      selectedCount={getSelectedCount()}
      transactionId={singleOwnerTransactionId}
    />
  );
}
