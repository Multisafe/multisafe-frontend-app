import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import formatDistance from "date-fns/formatDistance";
import { show } from "redux-modal";

import {
  Table,
  TableHead,
  TableBody,
  TableInfo,
  TableLoader,
} from "components/common/Table";
import Button from "components/common/Button";
import { useContract } from "hooks";
import { makeSelectTokenIcons } from "store/tokens/selectors";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import tokensReducer from "store/tokens/reducer";
import tokensSaga from "store/tokens/saga";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import { getTokens } from "store/tokens/actions";
import PlusIcon from "assets/icons/dashboard/white-plus-icon.svg";
import NoSpendingLimitsIcon from "assets/icons/dashboard/empty/spending-limits.svg";
import AllowanceModuleABI from "constants/abis/AllowanceModule.json";
import ERC20ABI from "constants/abis/ERC20.json";
import { InfoCard } from "components/People/styles";
import { getAmountFromWei } from "utils/tx-helpers";
import TokenImg from "components/common/TokenImg";
import Img from "components/common/Img";
import NewSpendingLimitModal, {
  MODAL_NAME as NEW_SPENDING_LIMIT_MODAL,
} from "./NewSpendingLimitModal";
import { useAddresses } from "hooks/useAddresses";

const tokensKey = "tokens";

export default function SpendingLimits() {
  const { ALLOWANCE_MODULE_ADDRESS, ZERO_ADDRESS } = useAddresses();

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
                    decimals
                  ),
                  spentAmount: getAmountFromWei(tokenAllowance[1], decimals),
                  resetTimeMin: tokenAllowance[2].toNumber(),
                  lastResetMin: tokenAllowance[3].toNumber(),
                  tokenName,
                });
              }
            }
          }
          return spendingLimits;
        } else {
          return [];
        }
      } catch (err) {
        console.error(err);
        return [];
      }
    }
  }, [allowanceModule, ownerSafeAddress, getERC20Contract, ZERO_ADDRESS]);

  useEffect(() => {
    let isMounted = true;

    getSpendingLimits().then((spendingLimits) => {
      if (isMounted) {
        setExistingSpendingLimits(spendingLimits);
        setLoadingLimits(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [getSpendingLimits]);

  const renderResetTime = (resetTimeMin, lastResetMin) => {
    const ms = 60 * 1000;
    if (resetTimeMin === 0) return "One-time";

    return `${formatDistance(
      new Date((lastResetMin + resetTimeMin) * ms),
      new Date(),
      { addSuffix: true }
    )}`;
  };

  const showNewSpendingLimitPopup = () => {
    dispatch(show(NEW_SPENDING_LIMIT_MODAL));
  };

  const renderNoSpendingLimits = () => (
    <TableInfo
      style={{
        textAlign: "center",
        height: "40rem",
      }}
    >
      <td colSpan={3}>
        <div className="d-flex align-items-center justify-content-center">
          <div>
            <Img
              src={NoSpendingLimitsIcon}
              alt="no-spending-limit"
              className="mb-4"
            />
            <div
              className="text-center"
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "#989898",
              }}
            >
              No spending limits yet!
            </div>
            <Button
              className="d-flex align-items-center mt-3"
              onClick={showNewSpendingLimitPopup}
            >
              <Img src={PlusIcon} alt="plus" className="mr-3" />
              <div>Create Spending Limit</div>
            </Button>
          </div>
        </div>
      </td>
    </TableInfo>
  );

  const renderAllSpendingLimits = () => {
    if (loadingLimits) return <TableLoader colSpan={3} />;

    if (existingSpendingLimits && !existingSpendingLimits.length)
      return renderNoSpendingLimits();

    return (
      existingSpendingLimits &&
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
          <tr key={`${delegate}-${idx}`}>
            <td style={{ width: "45%" }}>{delegate}</td>
            <td style={{ width: "30%" }}>
              <TokenImg token={tokenName} /> {spentAmount} of {allowanceAmount}{" "}
              {tokenName}
            </td>
            <td style={{ width: "25%" }}>
              {renderResetTime(resetTimeMin, lastResetMin)}
            </td>
          </tr>
        )
      )
    );
  };

  return (
    <div>
      <InfoCard>
        <div>
          <div className="title">Spending Limits</div>
          <div className="subtitle">View and manage spending limits here</div>
        </div>
        <div>
          <Button className="primary" onClick={showNewSpendingLimitPopup}>
            <Img src={PlusIcon} alt="plus" className="mr-2" /> Create Spending
            Limit
          </Button>
        </div>
      </InfoCard>
      <Table style={{ marginTop: "3rem" }}>
        <TableHead>
          <tr>
            <th style={{ width: "45%" }}>Beneficiary</th>
            <th style={{ width: "30%" }}>Spent</th>
            <th style={{ width: "25%" }}>Reset Time</th>
          </tr>
        </TableHead>
        <TableBody>{renderAllSpendingLimits()}</TableBody>
      </Table>
      <NewSpendingLimitModal />
    </div>
  );
}
