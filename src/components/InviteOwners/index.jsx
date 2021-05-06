import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faEdit } from "@fortawesome/free-solid-svg-icons";
import ReactTooltip from "react-tooltip";
import { Col, Row } from "reactstrap";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { cryptoUtils } from "parcel-sdk";
import { show } from "redux-modal";

import { Card } from "components/common/Card";
import Button from "components/common/Button";
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

import { Title, Heading, InfoCard } from "components/People/styles";
import { OwnersContainer, OwnerDetails, StepDetails } from "./styles";
import QuestionIcon from "assets/icons/dashboard/question-icon.svg";
import Step1Png from "assets/icons/invite/step-1.png";
import Step2Png from "assets/icons/invite/step-2.png";
import Step3Png from "assets/icons/invite/step-3.png";
import EditOwnerModal, {
  MODAL_NAME as EDIT_OWNER_MODAL,
} from "./EditOwnerModal";
import Avatar from "components/common/Avatar";
import InfoIcon from "assets/icons/dashboard/info-icon.svg";

const invitationKey = "invitation";

export default function InviteOwners() {
  const [encryptionKey] = useLocalStorage("ENCRYPTION_KEY");
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
  const loading = useSelector(makeSelectLoading());
  const creatingInvitation = useSelector(makeSelectCreating());
  const successfullyInvited = useSelector(makeSelectSuccess());
  const organisationType = useSelector(makeSelectOrganisationType());
  const isOrganisationPrivate = useSelector(makeSelectIsOrganisationPrivate());

  const dispatch = useDispatch();

  useEffect(() => {
    if (ownerSafeAddress) {
      dispatch(getInvitations(ownerSafeAddress));
    }
  }, [dispatch, ownerSafeAddress]);

  useEffect(() => {
    if (successfullyInvited && ownerSafeAddress) {
      dispatch(getInvitations(ownerSafeAddress));
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

  const inviteOwner = () => {
    if (!account || !ownerToBeInvited || !ownerSafeAddress) return;
    dispatch(
      createInvitation({
        safeAddress: ownerSafeAddress,
        createdBy: account,
        toAddress: ownerToBeInvited,
        fromAddress: account,
        toEmail: "",
        fromEmail: "hello@multisafe.finance", // TODO: change this later
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

  const handleEditName = (name, ownerAddress) => {
    dispatch(show(EDIT_OWNER_MODAL, { name, ownerAddress }));
  };

  const renderInvitationStatus = (owner, invitationDetails, idx) => {
    if (owner === account) {
      return (
        <div className="d-flex align-items-center">
          <div className="you-status">YOU</div>
          <div className="highlighted-status ml-3">Member</div>
        </div>
      );
    }

    if (!isOrganisationPrivate) {
      return <div className="highlighted-status">Member</div>;
    }

    if (!invitationDetails) {
      return (
        <div className="invite-status" onClick={inviteOwner}>
          Invite
        </div>
      );
    }

    if (invitationDetails && invitationDetails.status === 0) {
      // sent invite and awaiting confirmation
      const tooltip =
        "This member has not yet joined the organisation.<br /> Please share the invite link with them.";
      return (
        <div className="d-flex align-items-center">
          <div className="awaiting-status mr-3">Awaiting Confirmation</div>
          {invitationDetails.invitationLink && (
            <CopyButton
              className="mr-3"
              id={`invitation-link-${idx}`}
              tooltip="Invitation Link"
              value={invitationDetails.invitationLink}
            />
          )}

          <Img
            id={`invitation-info-${idx}`}
            src={InfoIcon}
            alt="info"
            data-for={`invitation-info-${idx}`}
            data-tip={tooltip}
          />
          <ReactTooltip
            id={`invitation-info-${idx}`}
            place={"right"}
            type={"dark"}
            effect={"solid"}
            multiline={true}
          />
        </div>
      );
    }

    if (invitationDetails && invitationDetails.status === 1) {
      // approve
      return (
        <div
          className="approve-status"
          onClick={() => approveOwner(owner, invitationDetails)}
        >
          Approve
        </div>
      );
    }

    if ((invitationDetails && invitationDetails.status === 2) || true) {
      // completed
      return <div className="joined-status">Member</div>;
    }

    return null;
  };

  const renderInviteOwners = () => {
    return (
      <div>
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
          safeOwners.map(
            ({ name: encryptedName, owner, invitationDetails }, idx) => {
              const isOwnerWithoutName =
                encryptedName === "0000" ? true : false;
              const name = isOwnerWithoutName
                ? "New Owner"
                : cryptoUtils.decryptDataUsingEncryptionKey(
                    encryptedName,
                    encryptionKey,
                    organisationType
                  );
              const firstName = name.split(" ")[0];
              const lastName = name.split(" ")[1];
              return (
                <div className="d-flex" key={`${owner}${idx}`}>
                  <OwnerDetails>
                    <div className="left">
                      <Avatar
                        firstName={firstName}
                        lastName={lastName}
                        style={{
                          fontSize: "1.2rem",
                          width: "3rem",
                          height: "3rem",
                        }}
                      />
                      <div className="details">
                        <div className="name">
                          {name}
                          <FontAwesomeIcon
                            icon={faEdit}
                            color="#8b8b8b"
                            className="ml-2 cursor-pointer"
                            onClick={() => handleEditName(name, owner)}
                            style={{ fontSize: "1.2rem" }}
                          />
                        </div>
                        <div className="address">Address: {owner}</div>
                      </div>
                    </div>
                    {renderInvitationStatus(owner, invitationDetails, idx)}
                  </OwnerDetails>
                </div>
              );
            }
          )}
        <EditOwnerModal />
      </div>
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
    );
  };

  return (
    <div>
      <InfoCard className="mt-5">
        <div>
          <div className="title">Members</div>
          <div className="subtitle">List of all owners of the safe</div>
          <div className="subtitle mt-2">
            Every transaction requires the confirmation of{" "}
            <span className="text-bold">
              {threshold} out of {safeOwners.length}
            </span>{" "}
            owners
          </div>
        </div>
        <Button iconOnly className="help">
          <Img src={QuestionIcon} alt="question" />
          <div className="ml-3 text">How invitation works</div>
        </Button>
      </InfoCard>
      <OwnersContainer>{renderInviteOwners()}</OwnersContainer>
    </div>
  );
}
