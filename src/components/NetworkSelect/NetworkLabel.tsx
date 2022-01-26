import React from "react";
import { CHAIN_IDS, NETWORK_NAMES } from "constants/networks";
import styled from "styled-components/macro";
import Img from "components/common/Img";
import Checkmark from "assets/icons/navbar/checkmark.svg";

type Props = {
  chainId: number;
  selected?: boolean;
};

const NETWORK_ID_TO_LABEL = {
  [CHAIN_IDS[NETWORK_NAMES.ETHEREUM]]: "Ethereum",
  [CHAIN_IDS[NETWORK_NAMES.RINKEBY]]: "Rinkeby",
  [CHAIN_IDS[NETWORK_NAMES.POLYGON]]: "Polygon",
  [CHAIN_IDS[NETWORK_NAMES.BSC]]: "BSC",
  [CHAIN_IDS[NETWORK_NAMES.AVALANCHE]]: "Avalanche",
};

const NETWORK_ID_TO_COLOR = {
  [CHAIN_IDS[NETWORK_NAMES.ETHEREUM]]: "#E8E7E6",
  [CHAIN_IDS[NETWORK_NAMES.RINKEBY]]: "#E8673D",
  [CHAIN_IDS[NETWORK_NAMES.POLYGON]]: "#8B50ED",
  [CHAIN_IDS[NETWORK_NAMES.BSC]]: "#f3ba2f",
  [CHAIN_IDS[NETWORK_NAMES.AVALANCHE]]: "#e84142",
};

const LabelContainer = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 1.4rem;
`;

const LabelColor = styled.div`
  width: 1rem;
  height: 1rem;
  border-radius: 0.2rem;
  position: relative;
  top: 0.3rem;
`;

const LabelSelected = styled(Img)`
  margin-left: auto;
`;

export const NetworkLabel = ({ chainId, selected }: Props) => {
  return (
    <LabelContainer>
      <LabelColor style={{ backgroundColor: NETWORK_ID_TO_COLOR[chainId] }} />
      <div>{NETWORK_ID_TO_LABEL[chainId]}</div>
      {selected ? (
        <LabelSelected src={Checkmark} alt={"Network Selected"} />
      ) : null}
    </LabelContainer>
  );
};
