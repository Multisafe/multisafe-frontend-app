import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import ReactTooltip from "react-tooltip";
import { useSelector, useDispatch } from "react-redux";
import { cryptoUtils } from "parcel-sdk";
import { show } from "redux-modal";

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
  makeSelectIsReadOnly,
} from "store/global/selectors";
import Loading from "components/common/Loading";
import { useActiveWeb3React } from "hooks";
import CopyButton from "components/common/Copy";
import Img from "components/common/Img";

import { InfoCard } from "components/People/styles";
import { OwnersContainer, OwnerDetails } from "./styles";
import QuestionIcon from "assets/icons/dashboard/question-icon.svg";
import EditOwnerModal, {
  MODAL_NAME as EDIT_OWNER_MODAL,
} from "./EditOwnerModal";
import InvitationStepsModal, {
  MODAL_NAME as INVITE_STEPS_MODAL,
} from "./InvitationStepsModal";
import Avatar from "components/common/Avatar";
import InfoIcon from "assets/icons/dashboard/info-icon.svg";

const invitationKey = "invitation";

export default function InviteOwners() {
  const [encryptionKey] = useLocalStorage("ENCRYPTION_KEY");
  const [members, setMembers] = useState([]);
  const [pendingOwners, setPendingOwners] = useState([]);

  const { account } = useActiveWeb3React();

  // Reducers
  useInjectReducer({ key: invitationKey, reducer: invitationReducer });

  // Sagas
  useInjectSaga({ key: invitationKey, saga: invitationSaga });

  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());
  const isReadOnly = useSelector(makeSelectIsReadOnly());
  const threshold = useSelector(makeSelectThreshold());
  const safeOwners = useSelector(makeSelectSafeOwners());
  const createdBy = useSelector(makeSelectCreatedBy());
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
    if (safeOwners) {
      const members = [];
      const pendingOwners = [];
      for (let i = 0; i < safeOwners.length; i++) {
        const { owner, invitationDetails } = safeOwners[i];
        const isMember =
          owner === createdBy ||
          (invitationDetails && invitationDetails.status === 2) ||
          !isOrganisationPrivate;
        if (isMember) members.push(safeOwners[i]);
        else pendingOwners.push(safeOwners[i]);
      }

      setMembers(members);
      setPendingOwners(pendingOwners);
    }
  }, [safeOwners, createdBy, isOrganisationPrivate]);

  const inviteOwner = (owner) => {
    if (!account || !owner || !ownerSafeAddress) return;
    dispatch(
      createInvitation({
        safeAddress: ownerSafeAddress,
        createdBy: account,
        toAddress: owner,
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

  const showInvitationSteps = () => {
    dispatch(show(INVITE_STEPS_MODAL));
  };

  const renderInvitationStatus = (owner, invitationDetails, idx) => {
    if (owner === account) {
      return (
        <div className="d-flex align-items-center">
          <div className="you-status">YOU</div>
          <div className="highlighted-status ml-3">Owner</div>
        </div>
      );
    }

    if (owner === createdBy) {
      return <div className="highlighted-status">Owner</div>;
    }

    if (!isOrganisationPrivate) {
      return <div className="highlighted-status">Owner</div>;
    }

    if (!invitationDetails) {
      return (
        <Button
          className="invite-status"
          style={{ minHeight: "0" }}
          onClick={() => inviteOwner(owner)}
          disabled={creatingInvitation || isReadOnly}
          loading={creatingInvitation}
        >
          Invite
        </Button>
      );
    }

    if (invitationDetails && invitationDetails.status === 0) {
      // sent invite and awaiting confirmation
      const tooltip =
        "This owner has not yet joined the organisation.<br /> Please share the invite link with them.";
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
          disabled={isReadOnly}
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

  const renderOwnerDetails = (
    { name: encryptedName, owner, invitationDetails },
    idx,
    noBackground = false
  ) => {
    const isOwnerWithoutName = encryptedName === "0000" ? true : false;
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
        <OwnerDetails backgroundColor={noBackground && "#fff"}>
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
          pendingOwners &&
          pendingOwners.map((ownerDetails, idx) =>
            renderOwnerDetails(ownerDetails, idx)
          )}
        {!loading &&
          members &&
          members.map((ownerDetails, idx) =>
            renderOwnerDetails(ownerDetails, idx, true)
          )}
        <EditOwnerModal />
      </div>
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
        {isOrganisationPrivate && (
          <Button iconOnly className="help" onClick={showInvitationSteps}>
            <Img src={QuestionIcon} alt="question" />
            <div className="ml-3 text">How invitation works</div>
          </Button>
        )}
      </InfoCard>
      <OwnersContainer>{renderInviteOwners()}</OwnersContainer>
      <InvitationStepsModal />
    </div>
  );
}
