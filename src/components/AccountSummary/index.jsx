import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowAltLeft } from "@fortawesome/free-solid-svg-icons";
import { Col, Row } from "reactstrap";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { getAddress } from "@ethersproject/address";
import { Info } from "components/Dashboard-old/styles";
import { Card } from "components/common/Card";
import Button from "components/common/Button";
import Img from "components/common/Img";
import { Input, ErrorMessage } from "components/common/Form";
import tokensReducer from "store/tokens/reducer";
import tokensSaga from "store/tokens/saga";
import {
  makeSelectTokenList,
  makeSelectLoading,
  makeSelectSuccess,
  makeSelectUpdating,
  makeSelectError,
  makeSelectTokenIcons,
} from "store/tokens/selectors";
import { getTokens, addCustomToken } from "store/tokens/actions";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import Loading from "components/common/Loading";

import { Title, Heading, ActionItem, Table } from "components/People/styles";
import { Circle } from "components/Header/styles";
import { Container } from "./styles";
import { isTestnet } from "constants/index";
import { formatNumber } from "utils/number-helpers";

const { TableBody, TableHead, TableRow } = Table;

const tokensKey = "tokens";

export default function AccountSummary() {
  // Reducers
  useInjectReducer({ key: tokensKey, reducer: tokensReducer });

  // Sagas
  useInjectSaga({ key: tokensKey, saga: tokensSaga });

  const { register, errors, handleSubmit, reset } = useForm({
    mode: "onChange",
  });

  const dispatch = useDispatch();
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());
  const history = useHistory();

  const [totalBalance, setTotalBalance] = useState("0.00");
  const [success, setSuccess] = useState(false);

  // Selectors
  const loading = useSelector(makeSelectLoading());
  const updating = useSelector(makeSelectUpdating());
  const tokenList = useSelector(makeSelectTokenList());
  const addedSuccessfully = useSelector(makeSelectSuccess());
  const error = useSelector(makeSelectError());
  const icons = useSelector(makeSelectTokenIcons());

  useEffect(() => {
    if (ownerSafeAddress && !icons) {
      dispatch(getTokens(ownerSafeAddress));
    }
  }, [ownerSafeAddress, dispatch, icons]);

  useEffect(() => {
    const total = tokenList.reduce(
      (sum, token) => (sum += parseFloat(token.usd)),
      0
    );
    setTotalBalance(parseFloat(total).toFixed(2));
  }, [tokenList]);

  useEffect(() => {
    if (addedSuccessfully) {
      setSuccess(true);
      reset({
        contractAddress: "",
      });
      setTimeout(() => {
        setSuccess(false);
      }, 2000);
    }
  }, [addedSuccessfully, reset]);

  const onSubmit = async (values) => {
    if (ownerSafeAddress) {
      dispatch(
        addCustomToken(ownerSafeAddress, getAddress(values.contractAddress))
      );
    }
  };

  const goBack = () => {
    history.goBack();
  };

  const renderAddCustomToken = () => (
    <Card className="add-custom-card">
      <Title className="mb-3">Add Token</Title>
      <Heading>Copy and paste the token contract address</Heading>
      <Row className="mt-3">
        <Col lg="8">
          <Input
            type="text"
            name="contractAddress"
            register={register}
            required={`Contract Address is required`}
            pattern={{
              value: /^0x[a-fA-F0-9]{40}$/,
              message: "Invalid Ethereum Address",
            }}
            placeholder="Token Contract Address"
          />
        </Col>
        <Col lg="4">
          <Button
            type="submit"
            className="p-0"
            large
            style={{ minHeight: "0", height: "100%" }}
            loading={updating}
            disabled={updating}
          >
            Add
          </Button>
        </Col>
      </Row>
      <ErrorMessage name="contractAddress" errors={errors} />
      {success && (
        <div className="text-success mt-3">Token added successfully!</div>
      )}
      {error && <div className="text-danger mt-3">{error}</div>}
    </Card>
  );

  const renderTokens = () => {
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <Row className="cards">
          <Col lg="6" className="pl-0">
            <Card className="balance-card">
              <div className="balance-title">Total Balance</div>
              <div className="balance-subtitle">
                ${formatNumber(totalBalance)}
              </div>
            </Card>
          </Col>
          <Col lg="6" className="pr-0">
            <Card className="interest-card">
              <div className="interest-title">Total Interest</div>
              <div className="interest-subtitle">Coming Soon</div>
            </Card>
          </Col>
        </Row>

        <div
          style={{
            position: "absolute",
            top: "60px",
            left: "0",
            right: "0",
          }}
        >
          <TableHead col={2} style={{ width: "683px" }} className="mx-auto">
            <div>Token Name</div>
            <div>Balance</div>
          </TableHead>
          <TableBody
            className="mx-auto"
            style={{
              height: "330px",
              minHeight: "0",
              overflow: "auto",
              width: "683px",
            }}
          >
            {loading && (
              <div
                className="d-flex align-items-center justify-content-center"
                style={{ height: "200px" }}
              >
                <Loading color="primary" width="50px" height="50px" />
              </div>
            )}
            {!loading &&
              tokenList.map(({ id, name, icon, usd, balance }) => (
                <TableRow col={2} key={id}>
                  <div>
                    <Img src={icon} alt="ether" width="30" /> {name}
                  </div>
                  <div>
                    {formatNumber(balance)} {name} (USD$
                    {formatNumber(usd)})
                  </div>
                </TableRow>
              ))}
          </TableBody>
        </div>
        {isTestnet && renderAddCustomToken()}
      </form>
    );
  };

  return (
    <div
      className="position-relative"
      style={{
        transition: "all 0.25s linear",
      }}
    >
      <Info>
        <div
          style={{
            maxWidth: "1200px",
            transition: "all 0.25s linear",
          }}
          className="mx-auto"
        >
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
      </Info>

      <Container
        style={{
          maxWidth: "1200px",
          transition: "all 0.25s linear",
        }}
      >
        {renderTokens()}
      </Container>
    </div>
  );
}
