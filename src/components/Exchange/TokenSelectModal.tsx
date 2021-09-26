import React, { useState, useMemo, useCallback } from "react";
import { connectModal as reduxModal, InjectedProps } from "redux-modal";
import { FixedSizeList } from "react-window";
import { Modal, ModalHeader, ModalBody } from "components/common/Modal";
import styled from "styled-components/macro";
import { Input } from "components/common/Form";
import { getAmountFromWei } from "utils/tx-helpers";

export const PAY_TOKEN_MODAL = "pay-token-modal";
export const RECEIVE_TOKEN_MODAL = "receive-token-modal";

type Props = InjectedProps & {
  title: string;
  tokenList: FixMe[];
  safeTokensByAddress: Record<string, FixMe>;
  onTokenSelect: (tokenDetails: FixMe) => void;
};

const ITEM_HEIGHT = 60;

const Container = styled.div`
  padding: 3rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const SearchInput = styled(Input)`
  border: none;
  border-bottom: 1px solid #dddcdc;

  &:focus {
    outline: none;
    border: none;
    border-bottom: solid 0.1rem ${({ theme }) => theme.primary};
  }
`;

const TokenItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;

  height: ${ITEM_HEIGHT}px;

  &:hover {
    cursor: pointer;
    background-color: rgba(20, 82, 245, 0.1);
  }
`;

const TokenLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const TokenInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const TokenName = styled.div`
  font-weight: bold;
  font-size: 1.4rem;
`;

const TokenSymbol = styled.div`
  font-size: 1.2rem;
`;

const TokenValue = styled.div`
  font-size: 1.6rem;
`;

function TokenSelectModalComponent(props: Props) {
  const {
    show,
    handleHide,
    title,
    tokenList,
    onTokenSelect,
    safeTokensByAddress,
  } = props;

  const [query, setQuery] = useState("");

  const onChange = (e: FixMe) => {
    console.log(e.target.value);
    setQuery(e.target.value || "");
  };

  const filteredTokensList = useMemo(() => {
    return query
      ? tokenList.filter(({ symbol, name }) => {
          return symbol.toLowerCase().startsWith(query.toLowerCase());
        })
      : tokenList;
  }, [tokenList, query]);

  const renderRow = useCallback(
    ({ index, style }) => {
      const { address, name, symbol, logoURI } = filteredTokensList[index];

      const tokenBalance = safeTokensByAddress[address]?.balance;
      const usdBalance = safeTokensByAddress[address]?.usd;

      if (tokenBalance) {
        console.log(safeTokensByAddress[address]);
      }

      const onClick = () => {
        onTokenSelect(address);
        handleHide();
      };

      return (
        <div style={style}>
          <TokenItem key={address} onClick={onClick}>
            <TokenLabel>
              <img src={logoURI} alt={name} width="30" />
              <TokenInfo>
                <TokenName>{name}</TokenName>
                <TokenSymbol>
                  {tokenBalance ? `${tokenBalance} ` : ""}
                  {symbol}
                </TokenSymbol>
              </TokenInfo>
            </TokenLabel>
            {usdBalance ? <TokenValue>≈ US${usdBalance}</TokenValue> : null}
          </TokenItem>
        </div>
      );
    },
    [onTokenSelect, handleHide, filteredTokensList]
  );

  return (
    <Modal isOpen={show} toggle={handleHide}>
      <ModalHeader title={title} toggle={handleHide} />
      <ModalBody width="55rem" minHeight="auto">
        <Container>
          <div>
            <SearchInput
              type="text"
              id="QUERY"
              name="QUERY"
              value={query}
              onChange={onChange}
              placeholder="Search Assets"
            />
          </div>
          <FixedSizeList
            {...{
              itemCount: filteredTokensList.length,
              itemSize: ITEM_HEIGHT,
              height: 400,
              width: "100%",
              overscanCount: 20,
            }}
          >
            {renderRow}
          </FixedSizeList>
        </Container>
      </ModalBody>
    </Modal>
  );
}

export const PayTokenModal = reduxModal({ name: PAY_TOKEN_MODAL })(
  TokenSelectModalComponent
);
export const ReceiveTokenModal = reduxModal({ name: RECEIVE_TOKEN_MODAL })(
  TokenSelectModalComponent
);
