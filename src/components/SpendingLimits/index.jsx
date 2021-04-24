import React, { useEffect, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowAltLeft, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import formatDistance from "date-fns/formatDistance";

import { Info } from "components/Dashboard/styles";
import Button from "components/common/Button";
import { useContract } from "hooks";
import { makeSelectTokenIcons } from "store/tokens/selectors";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import tokensReducer from "store/tokens/reducer";
import tokensSaga from "store/tokens/saga";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import { getTokens } from "store/tokens/actions";

import Loading from "components/common/Loading";
import { getDefaultIconIfPossible } from "constants/index";
import addresses from "constants/addresses";
import AllowanceModuleABI from "constants/abis/AllowanceModule.json";
import ERC20ABI from "constants/abis/ERC20.json";

import { Container, ActionItem, Table } from "components/People/styles";

import { Circle } from "components/Header/styles";
import { getAmountFromWei } from "utils/tx-helpers";
import { minifyAddress } from "components/common/Web3Utils";

const { TableBody, TableHead, TableRow } = Table;

const tokensKey = "tokens";

const { ALLOWANCE_MODULE_ADDRESS, ZERO_ADDRESS } = addresses;

export default function SpendingLimits() {
  const allowanceModule = useContract(
    ALLOWANCE_MODULE_ADDRESS,
    AllowanceModuleABI
  );
  const erc20Contract = useContract(ZERO_ADDRESS, ERC20ABI);

  const [existingSpendingLimits, setExistingSpendingLimits] = useState();
  const [loadingLimits, setLoadingLimits] = useState(false);

  // Reducers
  useInjectReducer({ key: tokensKey, reducer: tokensReducer });

  // Sagas
  useInjectSaga({ key: tokensKey, saga: tokensSaga });

  const dispatch = useDispatch();
  const history = useHistory();

  // Selectors
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());
  const icons = useSelector(makeSelectTokenIcons());

  useEffect(() => {
    if (ownerSafeAddress && !icons) {
      dispatch(getTokens(ownerSafeAddress));
    }
  }, [ownerSafeAddress, dispatch, icons]);

  const getERC20Contract = useCallback(
    (contractAddress) => {
      if (contractAddress) return erc20Contract.attach(contractAddress);
      return erc20Contract;
    },
    [erc20Contract]
  );

  const getSpendingLimits = useCallback(async () => {
    if (ownerSafeAddress && allowanceModule) {
      try {
        setLoadingLimits(true);
        const start = 0;
        const pageSize = 255; // max uint8 value
        const allDelegates = await allowanceModule.getDelegates(
          ownerSafeAddress,
          start,
          pageSize
        );

        if (allDelegates && allDelegates.results) {
          const spendingLimits = [];
          const { results: delegates } = allDelegates;

          for (let i = 0; i < delegates.length; i++) {
            const tokens = await allowanceModule.getTokens(
              ownerSafeAddress,
              delegates[i]
            );

            if (tokens && tokens.length > 0) {
              for (let j = 0; j < tokens.length; j++) {
                const tokenAllowance = await allowanceModule.getTokenAllowance(
                  ownerSafeAddress,
                  delegates[i],
                  tokens[j]
                );

                let tokenName;
                let tokenAddress = tokens[j];
                let decimals = 18;

                if (tokenAddress === ZERO_ADDRESS) {
                  // ETH
                  tokenName = "ETH";
                } else {
                  const erc20 = getERC20Contract(tokenAddress);
                  decimals = await erc20.decimals();
                  tokenName = await erc20.symbol();
                }

                spendingLimits.push({
                  delegate: delegates[i],
                  allowanceAmount: getAmountFromWei(
                    tokenAllowance[0],
                    decimals,
                    0
                  ),
                  spentAmount: getAmountFromWei(tokenAllowance[1], decimals, 2),
                  resetTimeMin: tokenAllowance[2].toNumber(),
                  lastResetMin: tokenAllowance[3].toNumber(),
                  tokenName,
                });
              }
            }
          }
          setExistingSpendingLimits(spendingLimits);
          setLoadingLimits(false);
        } else {
          setExistingSpendingLimits([]);
          setLoadingLimits(false);
        }
      } catch (err) {
        console.error(err);
        setExistingSpendingLimits([]);
        setLoadingLimits(false);
      }
    }
  }, [allowanceModule, ownerSafeAddress, getERC20Contract]);

  useEffect(() => {
    getSpendingLimits();
  }, [getSpendingLimits]);

  const goBack = () => {
    history.goBack();
  };

  const renderResetTime = (resetTimeMin, lastResetMin) => {
    const ms = 60 * 1000;
    if (resetTimeMin === 0) return "One-time";

    return `${formatDistance(
      new Date((lastResetMin + resetTimeMin) * ms),
      new Date(),
      { addSuffix: true }
    )}`;
  };

  const renderAllSpendingLimits = () => {
    return (
      <div
        style={{
          position: "absolute",
          top: "0em",
          left: "0",
          right: "0",
        }}
      >
        <TableHead col={3} style={{ width: "683px" }} className="mx-auto">
          <div>Beneficiary</div>
          <div>Spent</div>
          <div>Reset Time</div>
        </TableHead>
        <TableBody
          className="mx-auto"
          style={{
            height: "420px",
            minHeight: "0",
            overflow: "auto",
            width: "683px",
          }}
        >
          {loadingLimits && (
            <div
              className="d-flex align-items-center justify-content-center"
              style={{ height: "400px" }}
            >
              <Loading color="primary" width="50px" height="50px" />
            </div>
          )}
          {!loadingLimits &&
            existingSpendingLimits &&
            !existingSpendingLimits.length && (
              <div
                className="d-flex align-items-center justify-content-center"
                style={{ height: "400px" }}
              >
                <div>
                  <div className="text-center">No spending limits yet!</div>
                  <div className="d-flex align-items-center justify-content-center">
                    <Button
                      className="d-flex align-items-center mt-3"
                      to={`/dashboard/spending-limits/new`}
                    >
                      <FontAwesomeIcon
                        icon={faPlus}
                        color="#fff"
                        className="mr-2"
                      />
                      <div>Create Spending Limit</div>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          {!loadingLimits &&
            existingSpendingLimits &&
            existingSpendingLimits.length > 0 &&
            existingSpendingLimits.map(
              (
                {
                  delegate,
                  allowanceAmount,
                  spentAmount,
                  resetTimeMin,
                  lastResetMin,
                  tokenName,
                },
                idx
              ) => (
                <TableRow col={3} key={`${delegate}-${idx}`}>
                  <div>{minifyAddress(delegate)}</div>
                  <div>
                    <img
                      src={getDefaultIconIfPossible(tokenName, icons)}
                      alt={tokenName}
                      width="16"
                    />{" "}
                    {spentAmount} of {allowanceAmount} {tokenName}
                  </div>
                  <div>{renderResetTime(resetTimeMin, lastResetMin)}</div>
                </TableRow>
              )
            )}
        </TableBody>
      </div>
    );
  };

  return (
    <div className="position-relative">
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
              <Button iconOnly className="p-0" onClick={goBack}>
                <ActionItem>
                  <Circle>
                    <FontAwesomeIcon icon={faLongArrowAltLeft} color="#fff" />
                  </Circle>
                  <div className="mx-3">
                    <div className="name">Back</div>
                  </div>
                </ActionItem>
              </Button>
            </div>
            <div>
              <Button
                iconOnly
                className="p-0 mr-3"
                to={`/dashboard/spending-limits/new`}
              >
                <ActionItem>
                  <Circle>
                    <FontAwesomeIcon icon={faPlus} color="#fff" />
                  </Circle>
                  <div className="mx-3">
                    <div className="name">Create Spending Limit</div>
                  </div>
                </ActionItem>
              </Button>
            </div>
          </div>
        </div>
      </Info>

      <Container
        style={{
          maxWidth: "1200px",
          transition: "all 0.25s linear",
        }}
      >
        {renderAllSpendingLimits()}
      </Container>
    </div>
  );
}
