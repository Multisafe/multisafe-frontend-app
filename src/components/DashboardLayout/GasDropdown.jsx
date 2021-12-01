import React, { useEffect } from "react";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";

import { useDropdown, useActiveWeb3React } from "hooks";
import Img from "components/common/Img";
import GasIcon from "assets/icons/navbar/gas-icon.svg";
import { getGasPrice, setSelectedGasPrice } from "store/gas/actions";
import gasPriceSaga from "store/gas/saga";
import gasPriceReducer from "store/gas/reducer";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import {
  makeSelectAllGasPrices,
  makeSelectSelectedGasPrice,
} from "store/gas/selectors";
import {
  makeSelectGasMode,
  makeSelectOwnerSafeAddress,
} from "store/global/selectors";
import { setGasMode } from "store/global/actions";
import { GAS_MODES } from "store/gas/constants";
import { getAmountFromWei } from "utils/tx-helpers";
import { formatNumber } from "utils/number-helpers";

import { Gas } from "./styles";
import { setSafeSettings } from "store/safeSettings/actions";

const gasKey = "gas";

const gasOptions = [
  {
    name: "Standard",
    gasMode: GAS_MODES.STANDARD,
  },
  {
    name: "Fast",
    gasMode: GAS_MODES.FAST,
  },
  {
    name: "Instant",
    gasMode: GAS_MODES.INSTANT,
  },
];
const GAS_MODE_TO_API_SETTING = {
  [GAS_MODES.STANDARD]: "standard",
  [GAS_MODES.FAST]: "fast",
  [GAS_MODES.INSTANT]: "instant",
};

export default function GasDropdown() {
  const { open, toggleDropdown } = useDropdown();

  useInjectReducer({ key: gasKey, reducer: gasPriceReducer });
  useInjectSaga({ key: gasKey, saga: gasPriceSaga });

  const dispatch = useDispatch();
  const { chainId, account } = useActiveWeb3React();

  const selectedGasMode = useSelector(makeSelectGasMode());
  const selectedGasPrice = useSelector(makeSelectSelectedGasPrice());
  const gasPrices = useSelector(makeSelectAllGasPrices());
  const safeAddress = useSelector(makeSelectOwnerSafeAddress());

  useEffect(() => {
    // get gas prices
    dispatch(getGasPrice());
  }, [dispatch]);

  const chooseGasMode = (mode) => {
    dispatch(setGasMode(mode));
    dispatch(
      setSafeSettings({
        networkId: chainId,
        safeAddress,
        userAddress: account,
        gasSetting: GAS_MODE_TO_API_SETTING[mode],
      })
    );
  };

  useEffect(() => {
    if (gasPrices && selectedGasMode && gasPrices[selectedGasMode])
      dispatch(setSelectedGasPrice(gasPrices[selectedGasMode]));
  }, [dispatch, selectedGasMode, gasPrices]);

  const renderGasPrice = (gasPriceInWei) => {
    const gas = getAmountFromWei(gasPriceInWei, 9);

    return <span>{formatNumber(gas, 2)}</span>;
  };

  return (
    <Gas onClick={toggleDropdown}>
      <Img src={GasIcon} alt="gas" className="mr-2" />
      <div className="text">
        {selectedGasPrice ? formatNumber(selectedGasPrice.toString(), 2) : ""}
      </div>
      <FontAwesomeIcon icon={faAngleDown} className="ml-3" color="#373737" />
      <div className={`gas-dropdown ${open && "show"}`}>
        <div className="gas-title">Select Gas Setting</div>
        <div className="gas-options">
          {gasOptions.map(({ name, gasMode }) => (
            <div
              key={gasMode}
              className={`gas-option ${
                gasMode === selectedGasMode && `active`
              }`}
              onClick={(e) => {
                e.stopPropagation();
                chooseGasMode(gasMode);
              }}
            >
              <div className="name">{name}</div>
              <div className="value">
                (
                {gasPrices && gasPrices[gasMode]
                  ? renderGasPrice(gasPrices[gasMode])
                  : 0}{" "}
                Gwei)
              </div>
            </div>
          ))}
        </div>
      </div>
    </Gas>
  );
}
