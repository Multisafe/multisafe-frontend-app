import React from "react";
import { useActiveWeb3React } from "hooks";
import { useDispatch } from "react-redux";
import Select from "react-select";
import { CHAIN_IDS, NETWORK_NAMES } from "constants/networks";
import { inputStyles } from "components/common/Form";
import { NetworkLabel } from "./NetworkLabel";
import styled from "styled-components/macro";
import { logoutUser } from "store/logout/actions";

const StyledSelect = styled(Select)``;

export const NetworkSelect = () => {
  const dispatch = useDispatch();
  const { onboard, chainId, setChainId } = useActiveWeb3React();

  const onChange = ({ value }: FixMe) => {
    if (onboard) {
      onboard.walletReset();
    }
    dispatch(logoutUser());
    setChainId(value);
  };

  const options = [
    {
      value: CHAIN_IDS[NETWORK_NAMES.ETHEREUM],
      label: (
        <NetworkLabel
          chainId={CHAIN_IDS[NETWORK_NAMES.ETHEREUM]}
          selected={chainId === CHAIN_IDS[NETWORK_NAMES.ETHEREUM]}
        />
      ),
    },
    {
      value: CHAIN_IDS[NETWORK_NAMES.RINKEBY],
      label: (
        <NetworkLabel
          chainId={CHAIN_IDS[NETWORK_NAMES.RINKEBY]}
          selected={chainId === CHAIN_IDS[NETWORK_NAMES.RINKEBY]}
        />
      ),
    },
    {
      value: CHAIN_IDS[NETWORK_NAMES.POLYGON],
      label: (
        <NetworkLabel
          chainId={CHAIN_IDS[NETWORK_NAMES.POLYGON]}
          selected={chainId === CHAIN_IDS[NETWORK_NAMES.POLYGON]}
        />
      ),
    },
  ];

  return (
    <StyledSelect
      name="networkSelect"
      value={{
        value: chainId,
        label: <NetworkLabel chainId={chainId} />,
      }}
      options={options}
      onChange={onChange}
      styles={inputStyles}
      width="15rem"
      isSearchable={false}
      isClearable={false}
    />
  );
};
