import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cryptoUtils } from "coinshift-sdk";
import { useForm } from "react-hook-form";
import Big from "big.js";
import { isEqual } from "lodash";

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
  makeSelectPeopleByTeam,
  makeSelectLoadingPeopleByTeam,
} from "store/view-people/selectors";
import { makeSelectError as makeSelectErrorInCreateTx } from "store/transactions/selectors";
import { getInvitations } from "store/invitation/actions";
import { makeSelectLoading as makeSelectLoadingSafeDetails } from "store/safe/selectors";
import { makeSelectUpdating as makeSelectAddTxLoading } from "store/multisig/selectors";
import {
  makeSelectLoading as makeSelectLoadingTokens,
  makeSelectTokenList,
  makeSelectPrices,
} from "store/tokens/selectors";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import { useActiveWeb3React, useEncryptionKey, useMassPayout } from "hooks";
import {
  makeSelectOwnerSafeAddress,
  makeSelectThreshold,
  makeSelectOrganisationType,
  makeSelectIsReadOnly,
  makeSelectIsMultiOwner,
} from "store/global/selectors";
import {
  Table,
  TableHead,
  TableBody,
  TableInfo,
  TableLoader,
} from "components/common/Table";
import { MassPayoutContainer, PaymentSummary } from "./styles";
import { TRANSACTION_MODES } from "constants/transactions";
import { formatNumber } from "utils/number-helpers";
import TokenImg from "components/common/TokenImg";
import { getDecryptedDetails } from "utils/encryption";
import { Input, Select, SelectToken } from "components/common/Form";
import { constructLabel } from "utils/tokens";
import CheckBox from "components/common/CheckBox";
import ErrorText from "components/common/ErrorText";
import { Alert, AlertMessage } from "components/common/Alert";
import { SearchNameInput } from "./styles/SearchNameInput";

// reducer/saga keys
const viewPeopleKey = "viewPeople";
const viewTeamsKey = "viewTeams";

export default function Payments() {
  const [encryptionKey] = useEncryptionKey();
  const { register, handleSubmit, control, setValue, watch } = useForm({
    mode: "onChange",
  });

  const selectedTeamId = watch("team") && watch("team").value;
  const selectedToken = watch("token") && watch("token").value;
  const watchedAmounts = watch("amounts");

  const { account } = useActiveWeb3React();

  const [checked, setChecked] = useState([]);
  const [isCheckedAll, setIsCheckedAll] = useState(false);
  const [people, setPeople] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedTokenDetails, setSelectedTokenDetails] = useState();
  const [isSelectedTokenUSD, setIsSelectedTokenUSD] = useState();
  const [existingTokenDetails, setExistingTokenDetails] = useState();
  const [tokensDropdown, setTokensDropdown] = useState([]);
  const [teamsDropdown, setTeamsDropdown] = useState();
  const [tokenError, setTokenError] = useState(false);
  const [amountError, setAmountError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { loadingTx, massPayout } = useMassPayout();

  // Reducers
  useInjectReducer({ key: viewPeopleKey, reducer: viewPeopleReducer });
  useInjectReducer({ key: viewTeamsKey, reducer: viewTeamsReducer });

  // Sagas
  useInjectSaga({ key: viewPeopleKey, saga: viewPeopleSaga });
  useInjectSaga({ key: viewTeamsKey, saga: viewTeamsSaga });

  const dispatch = useDispatch();

  // Selectors
  const allTeams = useSelector(makeSelectTeams());
  const loadingTeams = useSelector(makeSelectTeamsLoading());
  const loadingTeammates = useSelector(makeSelectLoadingPeopleByTeam());
  const teammates = useSelector(makeSelectPeopleByTeam());
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());
  const prices = useSelector(makeSelectPrices());
  const errorFromMetaTx = useSelector(makeSelectErrorInCreateTx());
  const addingTx = useSelector(makeSelectAddTxLoading());
  const threshold = useSelector(makeSelectThreshold());
  const loadingSafeDetails = useSelector(makeSelectLoadingSafeDetails());
  const tokenList = useSelector(makeSelectTokenList());
  const loadingTokens = useSelector(makeSelectLoadingTokens());
  const organisationType = useSelector(makeSelectOrganisationType());
  const teamIdToDetailsMap = useSelector(makeSelectTeamIdToDetailsMap());
  const isReadOnly = useSelector(makeSelectIsReadOnly());
  const isMultiOwner = useSelector(makeSelectIsMultiOwner());

  useEffect(() => {
    if (ownerSafeAddress) {
      dispatch(getInvitations(ownerSafeAddress));
    }
  }, [ownerSafeAddress, dispatch]);

  useEffect(() => {
    let dropdownList = [];
    if (allTeams && allTeams.length > 0 && !teamsDropdown) {
      dropdownList = allTeams.map(({ departmentId, name }) => ({
        value: departmentId,
        label: name,
      }));
      setTeamsDropdown(dropdownList);
    }
  }, [allTeams, existingTokenDetails, teamsDropdown]);

  useEffect(() => {
    if (selectedTeamId && teamIdToDetailsMap[selectedTeamId]) {
      setTokenError(false);
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
                {formatNumber(existingToken.balance, 5)} {existingToken.name}
              </div>
            ),
            imgUrl: existingToken.icon,
          }),
        });
      } else {
        if (tokenInfo && tokenInfo.symbol === "USD") {
          setValue("token", {
            value: existingTokenDetails[0].name,
            label: constructLabel({
              token: existingTokenDetails[0].name,
              component: (
                <div>
                  {formatNumber(existingTokenDetails[0].balance, 5)}{" "}
                  {existingTokenDetails[0].name}
                </div>
              ),
              imgUrl: existingTokenDetails[0].icon,
            }),
          });
        } else {
          setTokenError(
            `Please deposit ${tokenInfo.symbol} tokens into your safe and try again`
          );
          setValue("token", {
            value: tokenInfo.symbol,
            label: `0.00 ${tokenInfo.symbol}`,
          });
        }
      }
    }
  }, [selectedTeamId, existingTokenDetails, setValue]); // eslint-disable-line

  useEffect(() => {
    if (selectedTeamId) {
      dispatch(getPeopleByTeam(ownerSafeAddress, selectedTeamId));
    }
  }, [selectedTeamId, dispatch, ownerSafeAddress]);

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
                {formatNumber(details.balance, 5)} {details.name}
              </div>
            ),
            imgUrl: details.icon,
          }),
        }))
      );
    }
  }, [tokenList, tokensDropdown]);

  useEffect(() => {
    if (!allTeams) {
      dispatch(getTeams(ownerSafeAddress));
    }
  }, [dispatch, ownerSafeAddress, allTeams]);

  useEffect(() => {
    // reset to initial state
    setSelectedRows([]);
    setChecked([]);
    setIsCheckedAll(false);
  }, [selectedToken, selectedTeamId]);

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

  useEffect(() => {
    if (watchedAmounts) {
      const newSelectedRows = selectedRows.map(({ index, ...rest }) => ({
        ...rest,
        salaryAmount: watchedAmounts[index],
        index,
      }));
      if (!isEqual(selectedRows, newSelectedRows)) {
        setSelectedRows(newSelectedRows);
      }
    }
  }, [watchedAmounts, selectedRows]);

  useEffect(() => {
    if (
      selectedRows &&
      selectedRows.some(({ salaryAmount }) => salaryAmount <= 0)
    ) {
      setAmountError(true);
    } else {
      setAmountError(false);
    }
  }, [selectedRows]);

  const totalAmountToPay = useMemo(() => {
    if (!selectedRows.length) return 0;
    if (prices) {
      const totalAmount = selectedRows.reduce(
        (total, { salaryAmount, salaryToken }) => {
          // TODO use Big.js to fix precision errors
          if (salaryToken === "USD") {
            total += Number(salaryAmount);
          } else {
            total += prices[salaryToken] * salaryAmount;
          }

          return total;
        },
        0
      );

      return totalAmount ? new Big(totalAmount).round(2).toNumber() : 0;
    }
  }, [prices, selectedRows]);

  const totalAmountInToken = useMemo(() => {
    if (!selectedRows.length) return 0;
    if (prices) {
      return selectedRows.reduce((total, { salaryAmount, salaryToken }) => {
        // TODO use Big.js to fix precision errors
        if (salaryToken === selectedTokenDetails.name) {
          total += Number(salaryAmount);
        } else if (salaryToken === "USD") {
          total += salaryAmount / prices[selectedTokenDetails.name];
        } else {
          total +=
            (salaryAmount * prices[salaryToken]) /
            prices[selectedTokenDetails.name];
        }
        return total;
      }, 0);
    }
  }, [prices, selectedRows, selectedTokenDetails]);

  const selectedCount = useMemo(() => {
    return checked.filter(Boolean).length;
  }, [checked]);

  const handleMassPayout = async (receivers) => {
    const to = cryptoUtils.encryptDataUsingEncryptionKey(
      JSON.stringify(receivers),
      encryptionKey,
      organisationType
    );
    const baseRequestBody = {
      to,
      safeAddress: ownerSafeAddress,
      createdBy: account,
      tokenValue: receivers.reduce(
        (total, { salaryAmount }) => (total += parseFloat(salaryAmount)),
        0
      ),
      tokenCurrency: selectedTokenDetails.name,
      fiatValue: totalAmountToPay,
      fiatCurrency: "USD",
      addresses: receivers.map(({ address }) => address),
      transactionMode: TRANSACTION_MODES.MASS_PAYOUT,
    };
    await massPayout({
      receivers,
      tokenDetails: selectedTokenDetails,
      baseRequestBody,
    });
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

  const handleCheckAll = () => {
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
        const allRows = people.map(({ data, peopleId, ...rest }, index) => ({
          peopleId,
          ...getDecryptedDetails(data, encryptionKey, organisationType),
          index,
          ...rest,
        }));
        setSelectedRows(allRows);
      }
    }
  };

  const handleChecked = (teammateDetails, index) => {
    const newChecked = [...checked];
    newChecked[index] = !checked[index];
    setChecked(newChecked);

    if (
      newChecked.length === people.length &&
      newChecked.every((check) => check)
    ) {
      setIsCheckedAll(true);
    } else {
      setIsCheckedAll(false);
    }
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

  const onSearchQueryChange = (e) => {
    setSearchQuery(e?.target?.value || "");
  };

  const renderPayTable = () => {
    if (!people || !selectedToken) return;

    const peopleRows =
      !loadingTeammates &&
      people.length > 0 &&
      people.map(({ peopleId, data, ...rest }, idx) => {
        const { firstName, lastName, salaryAmount, salaryToken, address } =
          getDecryptedDetails(data, encryptionKey, organisationType);

        const lowerCaseFirstName = firstName.toLowerCase();
        const lowerCaseLastName = lastName.toLowerCase();
        const lowerCaseSearchQuery = searchQuery.toLowerCase();

        if (
          lowerCaseFirstName.includes(lowerCaseSearchQuery) ||
          lowerCaseLastName.includes(lowerCaseSearchQuery)
        ) {
          const teammateDetails = {
            firstName,
            lastName,
            salaryToken,
            salaryAmount,
            address,
            peopleId,
            index: idx,
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
                backgroundColor: checked[idx] ? "#e7eefe" : "#fff",
              }}
            >
              <td style={{ width: "30%" }}>
                <div className="d-flex align-items-center">
                  <CheckBox
                    type="checkbox"
                    id={`checkbox${idx}`}
                    name={`checkbox${idx}`}
                    checked={checked[idx] || false}
                    onChange={() => handleChecked(teammateDetails, idx)}
                  />
                  <div>
                    {firstName} {lastName}
                  </div>
                </div>
              </td>
              <td style={{ width: "25%" }}>
                <TokenImg token={salaryToken} />
                <span className="mr-2">
                  <Input
                    type="number"
                    name={`amounts[${idx}]`}
                    register={register}
                    style={{ width: "7rem" }}
                    placeholder="0"
                    defaultValue={salaryAmount}
                    onClick={(e) => e.stopPropagation()}
                    step=".0001"
                  />
                </span>
                <span>{salaryToken}</span>
              </td>
              <td style={{ width: "45%" }}>{address}</td>
            </tr>
          );
        } else {
          return null;
        }
      });

    const shouldRenderRows = peopleRows && peopleRows.some((value) => !!value);

    return (
      <div>
        {isMultiOwner ? (
          <Alert className="mt-5">
            <AlertMessage>
              Please execute this transaction using Coinshift as transactions
              executed from{" "}
              <a
                href={"https://gnosis-safe.io/app/#/"}
                rel="noopenner noreferrer"
                target="_blank"
              >
                {" "}
                Gnosis UI
              </a>{" "}
              might fail due to incorrect gas estimation.
            </AlertMessage>
          </Alert>
        ) : null}
        <div className="outer-flex mt-5 mb-1">
          <div className="table-title">Team Details</div>

          {!loadingTeammates && people.length > 0 && (
            <div className="select-all">
              <SearchNameInput
                type="text"
                name="search"
                placeholder="Search Teammates"
                value={searchQuery}
                onChange={onSearchQueryChange}
              />
              <CheckBox
                type="checkbox"
                id="allCheckbox"
                checked={isCheckedAll}
                onChange={handleCheckAll}
                label={`Select All`}
              />
            </div>
          )}
        </div>
        <Table>
          <TableHead>
            <tr>
              <th style={{ width: "30%" }}>Name</th>
              <th style={{ width: "25%" }}>Disbursement</th>
              <th style={{ width: "45%" }}>Address</th>
            </tr>
          </TableHead>
          <TableBody style={{ maxHeight: "25rem", overflow: "auto" }}>
            {loadingTeammates && <TableLoader colSpan={3} height="20rem" />}
            {!shouldRenderRows || (!loadingTeammates && !people.length)
              ? renderNoPeopleFound()
              : null}
            {peopleRows}
          </TableBody>
        </Table>
      </div>
    );
  };

  const renderPaymentSummary = () => {
    if (tokenError) return <ErrorText>{tokenError}</ErrorText>;

    if (!people || !selectedToken || !selectedTokenDetails) return null;
    const insufficientBalance =
      selectedTokenDetails.usd - totalAmountToPay > 0 ? false : true;
    return (
      <PaymentSummary>
        <div className="payment-info">
          <div>
            <div className="payment-title">Current Balance</div>
            <div className="payment-subtitle text-bold">
              {`${formatNumber(selectedTokenDetails.balance, 5)} ${
                selectedTokenDetails.name
              }`}
            </div>
            <div className="payment-subtitle">{`US$ ${formatNumber(
              selectedTokenDetails.usd
            )}`}</div>
          </div>
          <div>
            <div className="payment-title">Balance after payment</div>
            <div className="payment-subtitle text-bold">
              {!insufficientBalance
                ? `${formatNumber(
                    selectedTokenDetails.balance - totalAmountInToken
                  )} ${selectedTokenDetails.name}`
                : `Insufficient Balance`}
            </div>
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
            <div className="payment-subtitle">{selectedCount} people</div>
          </div>
          <div>
            <div className="payment-title">Total Amount</div>
            <div className="payment-subtitle text-bold">
              {!isNaN(totalAmountInToken)
                ? `${formatNumber(totalAmountInToken)} ${
                    selectedTokenDetails.name
                  }`
                : `0`}
            </div>
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
              loadingTokens ||
              !selectedCount ||
              amountError ||
              isReadOnly
            }
          >
            {threshold > 1 ? `Create Transaction` : `Pay Now`}
          </Button>
        </div>
      </PaymentSummary>
    );
  };

  return (
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
              <ErrorText>{errorFromMetaTx}</ErrorText>
            )}
            {amountError && (
              <ErrorText>Please check if the amounts are correct</ErrorText>
            )}
          </div>
          {renderPaymentSummary()}
        </form>
      </div>
    </MassPayoutContainer>
  );
}
