import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { Col, Row } from "reactstrap";
import { arrayify } from "@ethersproject/bytes";

import Container from "react-bootstrap/Container";
import { useActiveWeb3React, useContract } from "hooks";
import ConnectButton from "components/Connect";
import { Card } from "components/common/Card";
import { Input, ErrorMessage } from "components/common/Form";

import { useInjectReducer } from "utils/injectReducer";
import gasPriceSaga from "store/gas/saga";
import gasPriceReducer from "store/gas/reducer";
import { makeSelectAverageGasPrice } from "store/gas/selectors";
import { getGasPrice } from "store/gas/actions";

import Button from "components/common/Button";
import CircularProgress from "components/common/CircularProgress";
import Img from "components/common/Img";
import { useInjectSaga } from "utils/injectSaga";
import Loading from "components/common/Loading";
import ParcelLogo from "assets/images/parcel-logo-purple.png";
import WelcomeImage from "assets/images/welcome-new.png";
import addresses from "constants/addresses";
import AllowanceModuleABI from "constants/abis/AllowanceModule.json";
import { TransactionUrl } from "components/common/Web3Utils";
import { DEFAULT_GAS_PRICE } from "constants/index";
import {
  Background,
  InnerCard,
  StepDetails,
  StepInfo,
} from "components/Login/styles";

const STEPS = {
  ZERO: 0,
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
  SIX: 6,
};
const { ALLOWANCE_MODULE_ADDRESS, ZERO_ADDRESS } = addresses;
const gasPriceKey = "gas";

const getStepsCount = () => {
  return Object.keys(DELEGATE_TRANSFER_STEPS).length - 1;
};

const DELEGATE_TRANSFER_STEPS = {
  [STEPS.ZERO]: "Connect",
  [STEPS.ONE]: "Sign and Execute",
};

const DelegateTransfer = () => {
  const [loadingAccount, setLoadingAccount] = useState(true);
  const [loadingTx, setLoadingTx] = useState();
  const [txHash, setTxHash] = useState();
  const [step, chooseStep] = useState(STEPS.ZERO);

  const allowanceModule = useContract(
    ALLOWANCE_MODULE_ADDRESS,
    AllowanceModuleABI,
    true
  );

  const { active, account, library, chainId } = useActiveWeb3React();

  const { register, errors, handleSubmit } = useForm({
    mode: "onChange",
  });

  useInjectReducer({ key: gasPriceKey, reducer: gasPriceReducer });

  // Sagas
  useInjectSaga({ key: gasPriceKey, saga: gasPriceSaga });

  const dispatch = useDispatch();

  const averageGasPrice = useSelector(makeSelectAverageGasPrice());

  useEffect(() => {
    if (!averageGasPrice)
      // get gas prices
      dispatch(getGasPrice());
  }, [dispatch, averageGasPrice]);

  useEffect(() => {
    let timer;
    if (!active) {
      timer = setTimeout(() => {
        chooseStep(STEPS.ZERO);
        setLoadingAccount(false);
      }, 300);
    }
    if (active) setLoadingAccount(false);

    return () => clearTimeout(timer);
  }, [active]);

  // let signTypedData = async function (account, typedData, primaryType) {
  //   return new Promise(async function (resolve, reject) {
  //     // const digest = TypedDataUtils.encodeDigest(typedData);
  //     try {
  //       const signer = library.getSigner(account);
  //       const address = await signer.getAddress();
  //       const signature = await library.send("eth_signTypedData_v3", [
  //         address,
  //         JSON.stringify({
  //           domain: typedData.domain,
  //           types: typedData.types,
  //           message: typedData.message,
  //           primaryType,
  //         }),
  //       ]);

  //       if (signature) {
  //         resolve(signature);
  //       }
  //     } catch (err) {
  //       return reject(err);
  //     }
  //   });
  // };

  const signAndExecuteTransfer = async ({ safe, to, token, amount }) => {
    setLoadingTx(true);

    const paymentToken = ZERO_ADDRESS;
    const payment = 0;
    const delegate = account;

    const tokenAllowance = await allowanceModule.getTokenAllowance(
      safe,
      delegate,
      token
    );

    console.log({ tokenAllowance, amount: tokenAllowance[0].toString() });

    const tokens = await allowanceModule.getTokens(safe, delegate);
    console.log({ tokens });

    if (!tokenAllowance || !tokenAllowance.length) return;

    const nonce = Number(tokenAllowance[4].toString());
    const domain = {
      chainId: chainId,
      verifyingContract: allowanceModule.address,
    };

    const primaryType = "AllowanceTransfer";

    const types = {
      EIP712Domain: [
        { type: "uint256", name: "chainId" },
        { type: "address", name: "verifyingContract" },
      ],
      [primaryType]: [
        { type: "address", name: "safe" },
        { type: "address", name: "token" },
        { type: "uint96", name: "amount" },
        { type: "address", name: "paymentToken" },
        { type: "uint96", name: "payment" },
        { type: "uint16", name: "nonce" },
      ],
    };

    const message = {
      safe,
      token,
      amount,
      paymentToken,
      payment,
      nonce,
    };

    const typedData = {
      domain,
      types,
      message,
    };

    try {
      console.log({
        typedData,
      });
      // const signature = await signTypedData(account, typedData, primaryType);

      let transferHash = await allowanceModule.generateTransferHash(
        safe,
        token,
        to,
        amount,
        paymentToken,
        payment,
        nonce
      );

      const signer = library.getSigner(account);

      const sig = await signer.signMessage(arrayify(transferHash));

      let sigV = parseInt(sig.slice(-2), 16);
      // Metamask with ledger returns v = 01, this is not valid for ethereum
      // For ethereum valid V is 27 or 28
      // In case V = 0 or 01 we add it to 27 and then add 4
      // Adding 4 is required to make signature valid for safe contracts:
      // https://gnosis-safe.readthedocs.io/en/latest/contracts/signatures.html#eth-sign-signature
      switch (sigV) {
        case 0:
        case 1:
          sigV += 31;
          break;
        case 27:
        case 28:
          sigV += 4;
          break;
        default:
          throw new Error("Invalid signature");
      }

      let signature = sig.slice(0, -2) + sigV.toString(16);

      console.log({ signature });

      const gasLimit = await allowanceModule.estimateGas.executeAllowanceTransfer(
        safe,
        token,
        to,
        amount,
        paymentToken,
        payment,
        delegate,
        signature
      );
      console.log({ gasLimit });
      const tx = await allowanceModule.executeAllowanceTransfer(
        safe,
        token,
        to,
        amount,
        paymentToken,
        payment,
        delegate,
        signature,
        {
          gasLimit,
          gasPrice: averageGasPrice || DEFAULT_GAS_PRICE,
        }
      );

      setTxHash(tx.hash);
      setLoadingTx(false);
      await tx.wait();
      // call executeAllowanceTransfer
    } catch (error) {
      console.error(error);
      setLoadingTx(false);
    }
  };

  const goBack = () => {
    chooseStep(step - 1);
  };

  const goNext = () => {
    chooseStep(step + 1);
  };

  const onSubmit = async (values) => {
    const {
      safeAddress: safe,
      toAddress: to,
      tokenAddress: token,
      amount,
    } = values;

    if (!!library && !!account) {
      await signAndExecuteTransfer({
        safe,
        to,
        token,
        amount,
      });
    }
  };

  const renderConnect = () => (
    <div>
      <Img
        src={WelcomeImage}
        alt="welcome"
        width="70%"
        className="d-block mx-auto py-4"
      />
      <InnerCard height="260px">
        <h2 className="text-center mb-4">
          <img src={ParcelLogo} alt="parcel" width="240" />
        </h2>
        <div className="mt-2 title">
          Your one stop for crypto treasury management.
        </div>
        <div className="subtitle">
          {!active && `Please connect your Ethereum wallet to proceed.`}
        </div>
        {loadingAccount && (
          <div className="d-flex align-items-center justify-content-center">
            <Loading color="primary" width="50px" height="50px" />
          </div>
        )}
        {!loadingAccount &&
          (!active ? (
            <ConnectButton className="mx-auto d-block mt-4 connect" />
          ) : (
            <Button
              type="button"
              className="mx-auto d-block mt-4 connect"
              onClick={goNext}
            >
              Proceed
            </Button>
          ))}
      </InnerCard>
    </div>
  );

  const renderStepHeader = () => {
    const steps = DELEGATE_TRANSFER_STEPS;
    return (
      <div>
        <div style={{ height: "50px", padding: "8px 32px" }}>
          <Button iconOnly onClick={goBack} className="px-0">
            <FontAwesomeIcon icon={faArrowLeft} color="#aaa" />
          </Button>
        </div>
        <StepInfo>
          <div>
            <h3 className="title">Delegate Transfer</h3>
            <p className="next">
              {steps[step + 1] ? `Next: ${steps[step + 1]}` : `Finish`}
            </p>
          </div>
          <div className="step-progress">
            <CircularProgress
              current={step}
              max={getStepsCount()}
              color="#7367f0"
            />
          </div>
        </StepInfo>
      </div>
    );
  };

  const renderTransferForm = () => {
    return (
      <StepDetails>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="subtitle">Delegate Address (You):</div>
          <div className="subtitle mb-4"> {account}</div>
          <Row className="mb-4">
            <Col lg="8">
              <Input
                type="text"
                name="safeAddress"
                register={register}
                required={`Safe Address is required`}
                pattern={{
                  value: /^0x[a-fA-F0-9]{40}$/,
                  message: "Invalid Ethereum Address",
                }}
                placeholder="Safe Address"
              />
              <ErrorMessage name="safeAddress" errors={errors} />
            </Col>
          </Row>
          <Row className="mb-4">
            <Col lg="8">
              <Input
                type="text"
                name="tokenAddress"
                register={register}
                required={`Token Address is required`}
                pattern={{
                  value: /^0x[a-fA-F0-9]{40}$/,
                  message: "Invalid Ethereum Address",
                }}
                placeholder="Token Address"
              />
              <ErrorMessage name="tokenAddress" errors={errors} />
            </Col>
          </Row>
          <Row className="my-4">
            <Col lg="8">
              <Input
                type="text"
                name="toAddress"
                register={register}
                required={`To Address is required`}
                pattern={{
                  value: /^0x[a-fA-F0-9]{40}$/,
                  message: "Invalid Ethereum Address",
                }}
                placeholder="To Address"
              />
              <ErrorMessage name="toAddress" errors={errors} />
            </Col>
          </Row>
          <Row className="my-4">
            <Col lg="8">
              <Input
                type="number"
                step="0.001"
                name="amount"
                register={register}
                required={`Amount is required`}
                placeholder="Amount"
              />
              <ErrorMessage name="amount" errors={errors} />
            </Col>
          </Row>

          <Button
            type="submit"
            className="mx-auto d-block proceed-btn"
            loading={loadingTx}
            disabled={loadingTx}
          >
            Sign and Execute
          </Button>
        </form>
      </StepDetails>
    );
  };

  const renderSuccess = () => (
    <div>
      <Img
        src={WelcomeImage}
        alt="welcome"
        height="370px"
        className="d-block mx-auto"
      />
      <InnerCard height="257px">
        <h2 className="text-center">Transaction Submitted</h2>
        <div className="mt-2 mb-5 text-center">
          {txHash && (
            <TransactionUrl hash={txHash}>View on Etherscan</TransactionUrl>
          )}
        </div>
      </InnerCard>
    </div>
  );

  const renderSteps = () => {
    switch (step) {
      case STEPS.ZERO: {
        return renderConnect();
      }

      case STEPS.ONE: {
        return renderTransferForm();
      }

      default:
        return null;
    }
  };

  return (
    <Background withImage minHeight="92vh">
      <Container>
        {!txHash ? (
          <Card
            className="mx-auto"
            style={{
              minHeight: "600px",
              width: "90%",
              marginTop: "80px",
            }}
          >
            {step !== STEPS.ZERO && renderStepHeader()}
            {renderSteps()}
          </Card>
        ) : (
          <Card
            className="mx-auto"
            style={{
              minHeight: "600px",
              width: "90%",
              marginTop: "80px",
            }}
          >
            {renderSuccess()}
          </Card>
        )}
      </Container>
    </Background>
  );
};

export default DelegateTransfer;
