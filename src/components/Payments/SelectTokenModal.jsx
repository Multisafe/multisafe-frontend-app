import React, { useState, useEffect } from "react";
import { Modal, ModalHeader } from "reactstrap";
import { connectModal as reduxModal } from "redux-modal";
import { Col, Row } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";

import Button from "components/common/Button";
import { defaultTokenDetails } from "constants/index";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import tokensReducer from "store/tokens/reducer";
import tokensSaga from "store/tokens/saga";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import { getTokens } from "store/tokens/actions";
import { makeSelectLoading, makeSelectTokenList } from "store/tokens/selectors";
import Loading from "components/common/Loading";

import { Title, Heading } from "../People/styles";
import { TokenCard } from "./styles";
import { formatNumber } from "utils/number-helpers";

export const MODAL_NAME = "select-token-modal";

const modalStyles = `
  .modal-content {
    border-radius: 20px;
    border: none;
    padding: 20px;
    // width: 650px;
  }
`;

const tokensKey = "tokens";

function SelectTokenModal(props) {
  const {
    show,
    handleHide,
    selectedTokenDetails,
    setSelectedTokenDetails,
  } = props;
  // Reducers
  useInjectReducer({ key: tokensKey, reducer: tokensReducer });

  // Sagas
  useInjectSaga({ key: tokensKey, saga: tokensSaga });

  const dispatch = useDispatch();

  // Selectors
  const loading = useSelector(makeSelectLoading());
  const tokenList = useSelector(makeSelectTokenList());
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());

  const [tokenName, setTokenName] = useState();
  const [tokenDetails, setTokenDetails] = useState(defaultTokenDetails);

  useEffect(() => {
    if (ownerSafeAddress && (!tokenList || !tokenList.length)) {
      dispatch(getTokens(ownerSafeAddress));
    }
  }, [ownerSafeAddress, tokenList, dispatch]);

  useEffect(() => {
    if (selectedTokenDetails) setTokenName(selectedTokenDetails.name);
  }, [selectedTokenDetails]);

  useEffect(() => {
    if (tokenList && tokenList.length > 0) {
      setTokenDetails(tokenList);
    }
  }, [tokenList]);

  const confirmToken = () => {
    setSelectedTokenDetails(
      tokenDetails.filter(({ name }) => name === tokenName)[0]
    );
    handleHide();
  };

  return (
    <Modal isOpen={show} centered>
      <style>{modalStyles}</style>
      <ModalHeader toggle={handleHide} style={{ borderBottom: "none" }}>
        <Title className="mb-2">Choose Token</Title>
        <Heading>Here is the list of all supported tokens</Heading>
      </ModalHeader>
      {loading && (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ height: "400px" }}
        >
          <Loading color="primary" width="50px" height="50px" />
        </div>
      )}
      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        {!loading &&
          tokenDetails &&
          tokenDetails.map(({ balance, icon, id, name, usd }) => (
            <Row key={id} className="col-12">
              <TokenCard
                active={tokenName === name}
                onClick={() => setTokenName(name)}
              >
                <div className="token-icon">
                  <img src={icon} alt={name} width="35" />
                </div>
                <div>
                  <div className="value">{formatNumber(balance)}</div>
                  <div className="text">{name}</div>
                </div>
                <div className="divider"></div>
                <div>
                  <div className="value">US$ {formatNumber(usd)}</div>
                  <div className="text">Balance</div>
                </div>
                <div className="radio"></div>
                <div className="current">Selected</div>
              </TokenCard>
            </Row>
          ))}
      </div>

      <Row className="mt-4">
        <Col lg="5" sm="12" className="pr-0">
          <Button
            large
            type="button"
            onClick={handleHide}
            className="secondary"
          >
            Back
          </Button>
        </Col>
        <Col lg="7" sm="12">
          <Button large type="button" onClick={confirmToken}>
            Confirm
          </Button>
        </Col>
      </Row>
    </Modal>
  );
}

export default reduxModal({ name: MODAL_NAME })(SelectTokenModal);
