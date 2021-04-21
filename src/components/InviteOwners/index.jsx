import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLongArrowAltLeft,
  faUserCircle,
  faInfoCircle,
  faLink,
} from "@fortawesome/free-solid-svg-icons";
import { Col, Row } from "reactstrap";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { cryptoUtils } from "parcel-sdk";

import { Info } from "components/Dashboard-old/styles";
import { Card } from "components/common/Card";
import Button from "components/common/Button";
import { Input, ErrorMessage } from "components/common/Form";
import { useLocalStorage } from "hooks";
import invitationSaga from "store/invitation/saga";
import invitationReducer from "store/invitation/reducer";
import {
  getInvitations,
  createInvitation,
  approveInvitation,
} from "store/invitation/actions";
import {
  makeSelectLoading,
  makeSelectSafeOwners,
  makeSelectSuccess,
  makeSelectCreating,
  makeSelectCreatedBy,
} from "store/invitation/selectors";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import {
  makeSelectOrganisationType,
  makeSelectOwnerSafeAddress,
  makeSelectThreshold,
  makeSelectIsOrganisationPrivate,
} from "store/global/selectors";
import Loading from "components/common/Loading";
import { useActiveWeb3React } from "hooks";
import CopyButton from "components/common/Copy";
import Img from "components/common/Img";

import { Title, Heading, ActionItem } from "components/People/styles";
import { Container, OwnerDetails, StepDetails } from "./styles";
import { Circle } from "components/Header/styles";
import { minifyAddress } from "components/common/Web3Utils";
import Step1Png from "assets/icons/invite/step-1.png";
import Step2Png from "assets/icons/invite/step-2.png";
import Step3Png from "assets/icons/invite/step-3.png";

const invitationKey = "invitation";

export default function InviteOwners() {
  const [encryptionKey] = useLocalStorage("ENCRYPTION_KEY");
  const [showEmail, setShowEmail] = useState();
  const [ownerToBeInvited, setOwnerToBeInvited] = useState();
  const [displayInviteSteps, setDisplayInviteSteps] = useState(false);

  const { account } = useActiveWeb3React();

  // Reducers
  useInjectReducer({ key: invitationKey, reducer: invitationReducer });

  // Sagas
  useInjectSaga({ key: invitationKey, saga: invitationSaga });

  const { register, errors, handleSubmit, formState } = useForm({
    mode: "all",
  });

  // const dispatch = useDispatch();
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());
  const threshold = useSelector(makeSelectThreshold());
  const safeOwners = useSelector(makeSelectSafeOwners());
  const createdBy = useSelector(makeSelectCreatedBy());
  const loading = useSelector(makeSelectLoading());
  const creatingInvitation = useSelector(makeSelectCreating());
  const successfullyInvited = useSelector(makeSelectSuccess());
  const organisationType = useSelector(makeSelectOrganisationType());
  const isOrganisationPrivate = useSelector(makeSelectIsOrganisationPrivate());

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (ownerSafeAddress) {
      dispatch(getInvitations(ownerSafeAddress));
    }
  }, [dispatch, ownerSafeAddress]);

  useEffect(() => {
    if (successfullyInvited && ownerSafeAddress) {
      dispatch(getInvitations(ownerSafeAddress));
      setShowEmail();
    }
  }, [dispatch, successfullyInvited, ownerSafeAddress]);

  useEffect(() => {
    if (
      (safeOwners && safeOwners.some((owner) => owner.invitationDetails)) ||
      !isOrganisationPrivate
    ) {
      setDisplayInviteSteps(false);
    } else {
      setDisplayInviteSteps(true);
    }
  }, [safeOwners, isOrganisationPrivate]);

  const toggleShowOwners = () => {
    setDisplayInviteSteps((displayInviteSteps) => !displayInviteSteps);
  };

  const onSubmit = async (values) => {
    if (!account || !ownerToBeInvited || !ownerSafeAddress) return;
    dispatch(
      createInvitation({
        safeAddress: ownerSafeAddress,
        createdBy: account,
        toAddress: ownerToBeInvited,
        fromAddress: account,
        toEmail: values.email || "",
        fromEmail: "hello@parcel.money", // TODO: change this later
      })
    );
  };

  const approveOwner = async (owner, invitationDetails) => {
    if (!owner || !invitationDetails) return;

    const { toPublicKey, invitationId } = invitationDetails;
    const encryptionKeyData = await cryptoUtils.encryptUsingPublicKey(
      encryptionKey,
      toPublicKey
    );
    dispatch(
      approveInvitation(encryptionKeyData, invitationId, ownerSafeAddress)
    );
  };

  const goBack = () => {
    history.goBack();
  };

  const toggleShowEmail = (idx, owner) => {
    if (showEmail === idx) {
      setShowEmail();
      setOwnerToBeInvited();
    } else {
      setShowEmail(idx);
      setOwnerToBeInvited(owner);
    }
  };

  const renderInvitationStatus = (owner, invitationDetails, idx) => {
    if (owner === account) {
      return <div className="highlighted-status">You</div>;
    }
    if (owner === createdBy) {
      return <div className="highlighted-status">Owner</div>;
    }

    if (!isOrganisationPrivate) {
      return <div className="highlighted-status">Owner</div>;
    }

    if (!invitationDetails) {
      return (
        <div
          className="invite-status"
          onClick={() => toggleShowEmail(idx, owner)}
        >
          <Button
            large
            type="submit"
            style={{ minHeight: "0", height: "100%", fontSize: "14px" }}
            loading={creatingInvitation}
            className="px-3 py-2"
          >
            Invite to Parcel
          </Button>
        </div>
      );
    }

    if (invitationDetails && invitationDetails.status === 0) {
      // sent invite and awaiting confirmation
      return (
        <div className="d-flex align-items-center">
          <div className="awaiting-status mr-2">Awaiting Confirmation</div>
          {invitationDetails.invitationLink && (
            <CopyButton
              id={`invitation-link-${idx}`}
              tooltip="Invitation Link"
              value={invitationDetails.invitationLink}
            >
              <Button
                large
                type="button"
                style={{ minHeight: "0", height: "100%", fontSize: "12px" }}
                className="p-2"
              >
                {/* Copy */}
                <FontAwesomeIcon icon={faLink} color={"#fff"} />
              </Button>
            </CopyButton>
          )}
        </div>
      );
    }
    if (invitationDetails && invitationDetails.status === 1) {
      // approve
      return (
        <div
          className="approved-status"
          onClick={() => approveOwner(owner, invitationDetails)}
        >
          Approve
        </div>
      );
    }

    if (invitationDetails && invitationDetails.status === 2) {
      // completed
      return <div className="joined-status">Owner</div>;
    }

    return null;
  };

  // eslint-disable-next-line
  const renderEmail = () => (
    <div className="send-email">
      <Row>
        <Col lg="8">
          <Input
            type="text"
            name="email"
            register={register}
            // required={`Email is required`}
            pattern={{
              value: /\S+@\S+\.\S+/,
              message: "Invalid email address",
            }}
            placeholder="Email ID (Optional)"
          />
        </Col>
        <Col lg="4">
          <Button
            large
            type="submit"
            disabled={!formState.isValid}
            style={{ minHeight: "0", height: "100%" }}
            loading={creatingInvitation}
          >
            Send
          </Button>
        </Col>
      </Row>
      <ErrorMessage name="email" errors={errors} />
    </div>
  );

  const renderInviteOwners = () => {
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="invite-owners">
          <Row className="justify-content-between align-items-center mb-4">
            <Col lg="10">
              <Title className="mb-2">Owners</Title>
              <Heading>List of all owners of the safe</Heading>
            </Col>
            <Col lg="2" className="text-right">
              <Button iconOnly className="p-0" onClick={toggleShowOwners}>
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  color="#333"
                  style={{ fontSize: "28px" }}
                />
              </Button>
            </Col>
          </Row>
          {loading && (
            <div
              className="d-flex align-items-center justify-content-center"
              style={{ height: "250px" }}
            >
              <Loading color="primary" width="50px" height="50px" />
            </div>
          )}

          {!loading &&
            safeOwners &&
            safeOwners.map(({ name, owner, invitationDetails }, idx) => (
              <Row key={`${owner}${idx}`}>
                <Col lg="12">
                  <OwnerDetails>
                    <div className="left">
                      <div className="icon">
                        <FontAwesomeIcon icon={faUserCircle} color="#333" />
                      </div>
                      <div className="details">
                        <div className="name">
                          {cryptoUtils.decryptDataUsingEncryptionKey(
                            name,
                            encryptionKey,
                            organisationType
                          )}
                        </div>
                        <div className="address">
                          Address: {minifyAddress(owner)}
                        </div>
                      </div>
                    </div>
                    {renderInvitationStatus(owner, invitationDetails, idx)}
                    {/* {showEmail === idx && renderEmail()} */}
                  </OwnerDetails>
                </Col>
              </Row>
            ))}
          <Heading className="payment-status-threshold">
            Every transaction requires the confirmation of{" "}
            <span>
              {threshold} out of {safeOwners.length}
            </span>{" "}
            owners
          </Heading>
        </Card>
      </form>
    );
  };

  const renderStepsForPrivateOrganisation = () => (
    <React.Fragment>
      <Row className="align-items-center mt-4">
        <Col lg="2" className="pr-0">
          <Img src={Step1Png} alt="step1" width="64" />
        </Col>
        <Col lg="10" className="pl-0">
          <StepDetails>
            <div className="step-title">STEP 1</div>
            <div className="step-subtitle">Invite the Owners to Parcel</div>
          </StepDetails>
        </Col>
      </Row>
      <Row className="align-items-center mt-4">
        <Col lg="2" className="pr-0">
          <Img src={Step2Png} alt="step2" width="64" />
        </Col>
        <Col lg="10" className="pl-0">
          <StepDetails>
            <div className="step-title">STEP 2</div>
            <div className="step-subtitle">Owner Accepts the Invite</div>
          </StepDetails>
        </Col>
      </Row>
      <Row className="align-items-center mt-4">
        <Col lg="2" className="pr-0">
          <Img src={Step3Png} alt="step3" width="64" />
        </Col>
        <Col lg="10" className="pl-0">
          <StepDetails>
            <div className="step-title">STEP 3</div>
            <div className="step-subtitle">
              You Give Final Approval To The Owner
            </div>
          </StepDetails>
        </Col>
      </Row>
    </React.Fragment>
  );

  const renderStepsForPublicOrganisation = () => (
    <React.Fragment>
      <Row className="align-items-center mt-5 pt-5 mb-5 pb-5">
        {/* <Col lg="2" className="pr-0">
          <Img src={Step3Png} alt="step1" width="64" />
        </Col> */}
        <Col lg="12">
          <StepDetails>
            <div className="step-title d-flex justify-content-center align-items-center">
              {/* <div className="mr-2">SETUP COMPLETED</div> */}
              <CopyButton
                id={`invitation-link-final`}
                tooltip="Login Link"
                value={window.location.origin}
              >
                <Button
                  type="button"
                  style={{ minHeight: "0", height: "100%", fontSize: "12px" }}
                  className="p-2"
                >
                  <FontAwesomeIcon
                    icon={faLink}
                    color={"#fff"}
                    className="mx-1"
                  />
                  Copy Login Link
                </Button>
              </CopyButton>
            </div>
            <div className="step-subtitle mt-2 text-center">
              Share this link with the other owners and they can login to
              Parcel.
            </div>
          </StepDetails>
        </Col>
      </Row>
    </React.Fragment>
  );

  const renderInviteSteps = () => {
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="invite-owners">
          <Title className="mb-2">Owners</Title>
          <Heading>
            {isOrganisationPrivate
              ? `To allow other owners to use Parcel, follow these simple steps`
              : `All the owners can directly login to Parcel`}
          </Heading>
          {loading && (
            <div
              className="d-flex align-items-center justify-content-center"
              style={{ height: "250px" }}
            >
              <Loading color="primary" width="50px" height="50px" />
            </div>
          )}
          {!loading && (
            <React.Fragment>
              {isOrganisationPrivate
                ? renderStepsForPrivateOrganisation()
                : renderStepsForPublicOrganisation()}

              <Button
                large
                type="button"
                className="mt-5"
                onClick={toggleShowOwners}
              >
                View All Owners
              </Button>
            </React.Fragment>
          )}
        </Card>
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
        {displayInviteSteps ? renderInviteSteps() : renderInviteOwners()}
      </Container>
    </div>
  );
}
