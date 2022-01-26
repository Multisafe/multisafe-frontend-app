import React from "react";
import { useActiveWeb3React } from "hooks";
import Select from "react-select";
import { CHAIN_IDS, NETWORK_NAMES } from "constants/networks";
import { inputStyles } from "components/common/Form";
import { NetworkLabel } from "./NetworkLabel";
import styled from "styled-components/macro";

const StyledSelect = styled(Select)``;

export const NetworkSelect = () => {
  const { onboard, chainId, setChainId } = useActiveWeb3React();

  const onChange = ({ value }: FixMe) => {
    if (onboard) {
      onboard.walletReset();
    }
    setChainId(value);

    // eslint-disable-next-line
    location.reload();
  };

  const mainnetOptions = [
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
      value: CHAIN_IDS[NETWORK_NAMES.POLYGON],
      label: (
        <NetworkLabel
          chainId={CHAIN_IDS[NETWORK_NAMES.POLYGON]}
          selected={chainId === CHAIN_IDS[NETWORK_NAMES.POLYGON]}
        />
      ),
    },
    {
      value: CHAIN_IDS[NETWORK_NAMES.BSC],
      label: (
        <NetworkLabel
          chainId={CHAIN_IDS[NETWORK_NAMES.BSC]}
          selected={chainId === CHAIN_IDS[NETWORK_NAMES.BSC]}
        />
      ),
    },
    {
      value: CHAIN_IDS[NETWORK_NAMES.AVALANCHE],
      label: (
        <NetworkLabel
          chainId={CHAIN_IDS[NETWORK_NAMES.AVALANCHE]}
          selected={chainId === CHAIN_IDS[NETWORK_NAMES.AVALANCHE]}
        />
      ),
    }
  ];
  const testnetOptions = [
    {
      value: CHAIN_IDS[NETWORK_NAMES.RINKEBY],
      label: (
        <NetworkLabel
          chainId={CHAIN_IDS[NETWORK_NAMES.RINKEBY]}
          selected={chainId === CHAIN_IDS[NETWORK_NAMES.RINKEBY]}
        />
      ),
    },
  ];

  const options =
    process.env.CONFIG_ENV === "production"
      ? mainnetOptions
      : [...mainnetOptions, ...testnetOptions];

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

const StaticContainer = styled.div`
  height: 4rem;
  padding: 0 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  border-radius: 0.4rem;
`;

export const StaticNetworkSelect = () => {
  const { chainId } = useActiveWeb3React();

  return (
    <StaticContainer>
      <NetworkLabel chainId={chainId} />
    </StaticContainer>
  );
};
