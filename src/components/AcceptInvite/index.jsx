import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { hashMessage } from "@ethersproject/hash";
import { recoverAddress } from "@ethersproject/transactions";
import { toUtf8Bytes } from "@ethersproject/strings";
import { keccak256 } from "@ethersproject/keccak256";
// import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

import Container from "react-bootstrap/Container";
import { useActiveWeb3React, useLocalStorage } from "hooks";
import ConnectButton from "components/Connect";
import { Card } from "components/common/Card";
import { useInjectReducer } from "utils/injectReducer";
import invitationReducer from "store/invitation/reducer";
import invitationSaga from "store/invitation/saga";
import {
  makeSelectLoading,
  makeSelectSuccess,
  makeSelectError,
} from "store/invitation/selectors";
import { acceptInvitation } from "store/invitation/actions";
import Button from "components/common/Button";
import CircularProgress from "components/common/CircularProgress";
import Img from "components/common/Img";
import PrivacySvg from "assets/images/register/privacy.svg";
import { MESSAGE_TO_SIGN } from "constants/index";
import { useInjectSaga } from "utils/injectSaga";
import Loading from "components/common/Loading";
import TeamMembersPng from "assets/images/team-members.png";
import { getPublicKey } from "utils/encryption";
import ParcelLogo from "assets/images/parcel-logo-purple.png";
import WelcomeImage from "assets/images/welcome-new.png";

import {
  Background,
  InnerCard,
  StepDetails,
  StepInfo,
} from "components/Login/styles";

const invitationKey = "invitation";

const STEPS = {
  ZERO: 0,
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
  SIX: 6,
};

const getStepsCount = () => {
  return Object.keys(ACCEPT_INVITE_STEPS).length - 1;
};

const ACCEPT_INVITE_STEPS = {
  [STEPS.ZERO]: "Connect",
  [STEPS.ONE]: "Privacy",
  [STEPS.TWO]: "Accept Invitation",
};

const AcceptInvite = () => {
  const [sign, setSign] = useLocalStorage("SIGNATURE");
  const [hasAlreadySigned, setHasAlreadySigned] = useState(false);
  const [loadingAccount, setLoadingAccount] = useState(true);
  const [step, chooseStep] = useState(STEPS.ZERO);
  const [signing, setSigning] = useState(false);

  const { active, account, library, connector } = useActiveWeb3React();

  // Reducers
  useInjectReducer({ key: invitationKey, reducer: invitationReducer });

  // Sagas
  useInjectSaga({ key: invitationKey, saga: invitationSaga });

  const dispatch = useDispatch();
  const location = useLocation();

  // Selectors
  const loading = useSelector(makeSelectLoading());
  const success = useSelector(makeSelectSuccess());
  const error = useSelector(makeSelectError());

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

  useEffect(() => {
    if (sign) {
      const msgHash = hashMessage(MESSAGE_TO_SIGN);
      const recoveredAddress = recoverAddress(msgHash, sign);
      if (recoveredAddress !== account) {
        setHasAlreadySigned(false);
        setSign("");
        chooseStep(STEPS.ZERO);
      }
    }
  }, [account, sign, setSign]);

  useEffect(() => {
    if (step === STEPS.ONE && account) {
      if (sign) {
        const msgHash = hashMessage(MESSAGE_TO_SIGN);
        const recoveredAddress = recoverAddress(msgHash, sign);
        if (recoveredAddress === account) {
          setHasAlreadySigned(true);
        }
      }
    }
  }, [step, dispatch, account, sign]);

  const signTerms = async () => {
    if (!!library && !!account) {
      setSigning(true);
      try {
        if (connector.name === "WalletConnect") {
          const rawMessage = MESSAGE_TO_SIGN;
          const messageLength = new Blob([rawMessage]).size;
          const message = toUtf8Bytes(
            "\x19Ethereum Signed Message:\n" + messageLength + rawMessage
          );
          const hashedMessage = keccak256(message);

          connector.provider.wc
            .signMessage([account.toLowerCase(), hashedMessage])
            .then((signature) => {
              setSign(signature);
              setSigning(false);
              goNext();
            })
            .catch((error) => {
              setSigning(false);
              console.error("Signature Rejected");
            });
        } else {
          await library
            .getSigner(account)
            .signMessage(MESSAGE_TO_SIGN)
            .then((signature) => {
              setSign(signature);
              setSigning(false);
              chooseStep(step + 1);
            });
        }
      } catch (error) {
        console.error("Signature Rejected");
        setSigning(false);
      }
    }
  };

  const goBack = () => {
    chooseStep(step - 1);
  };

  const goNext = () => {
    chooseStep(step + 1);
  };

  const handleAccept = () => {
    const publicKey = getPublicKey(sign);
    const searchParams = new URLSearchParams(location.search);
    const invitationToken = searchParams.get("invitationToken");
    if (!invitationToken || !account) return;

    dispatch(acceptInvitation(publicKey, invitationToken, account));
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
    const steps = ACCEPT_INVITE_STEPS;
    return (
      <div>
        <div style={{ height: "50px", padding: "8px 32px" }}>
          <Button iconOnly onClick={goBack} className="px-0">
            <FontAwesomeIcon icon={faArrowLeft} color="#aaa" />
          </Button>
        </div>
        <StepInfo>
          <div>
            <h3 className="title">Accept Invite</h3>
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

  const renderPrivacy = () => {
    return (
      <StepDetails>
        <Img
          src={PrivacySvg}
          alt="privacy"
          className="my-2"
          width="130px"
          style={{ minWidth: "130px" }}
        />
        <h3 className="title">We care for Your Privacy </h3>

        {!hasAlreadySigned ? (
          <React.Fragment>
            <p className="subtitle mb-5 pb-5">
              Please sign to authorize Parcel.
            </p>
            <Button
              type="button"
              onClick={signTerms}
              className="mx-auto d-block proceed-btn"
              loading={signing}
              disabled={signing}
            >
              I'm in
            </Button>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <p className="subtitle mb-5 pb-5">
              You have already authorized Parcel. Simply click Next to continue.
            </p>
            <Button
              type="button"
              onClick={goNext}
              className="mx-auto d-block proceed-btn"
            >
              <span>Proceed</span>
              <span className="ml-3">
                <FontAwesomeIcon icon={faArrowRight} color="#fff" />
              </span>
            </Button>
          </React.Fragment>
        )}
      </StepDetails>
    );
  };

  const renderAcceptInvitation = () => {
    return (
      <StepDetails>
        <div className="text-center">
          <img src={TeamMembersPng} alt="humans" width="350px" />
        </div>
        <h3 className="title">Accept Invite and join Parcel</h3>

        <p className="subtitle pb-5">
          Once you accept the invitation, one of the owners will approve you.
          <br />
          Then, you can login and view the Parcel dashboard.
        </p>

        <Button
          type="button"
          onClick={handleAccept}
          className="mx-auto d-block proceed-btn"
          loading={loading}
          disabled={loading}
        >
          Accept
        </Button>
        {error && <p className="text-danger my-3">Error: {error}</p>}
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
        <h2 className="text-center">Invitation Accepted</h2>
        <div className="mt-2 mb-5 text-center">
          Great! Now, one of the owners will approve you
          <br />
          and you will be able to login to the Parcel dashboard.
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
        return renderPrivacy();
      }

      case STEPS.TWO: {
        return renderAcceptInvitation();
      }

      default:
        return null;
    }
  };

  return (
    <Background withImage minHeight="92vh">
      <Container>
        {!success ? (
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

export default AcceptInvite;
