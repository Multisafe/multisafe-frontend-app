import React, { useEffect, useState } from "react";
import ReactTooltip from "react-tooltip";
import { useSelector, useDispatch } from "react-redux";
import { cryptoUtils } from "parcel-sdk";
import { show } from "redux-modal";

import Button from "components/common/Button";
import { useLocalStorage } from "hooks";
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
import EditIcon from "assets/icons/dashboard/edit-icon.svg";
import ReplaceIcon from "assets/icons/dashboard/replace-icon.svg";
import DeleteIcon from "assets/icons/dashboard/trash-icon.svg";
import { getDecryptedDetails } from "utils/encryption";

export default function InviteOwners() {
  const [encryptionKey] = useLocalStorage("ENCRYPTION_KEY");
  const [members, setMembers] = useState([]);
  const [pendingOwners, setPendingOwners] = useState([]);

  const { account } = useActiveWeb3React();

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
        <div className="flex-gap">
          <div className="you-status">YOU</div>
          <div className="highlighted-status">Owner</div>
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
      : getDecryptedDetails(
          encryptedName,
          encryptionKey,
          organisationType,
          false
        );
    const firstName = name.split(" ")[0];
    const lastName = name.split(" ")[1];
    return (
      <React.Fragment key={`${owner}${idx}`}>
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
              <div className="name">{name}</div>
              <div className="address">Address: {owner}</div>
            </div>
          </div>
          <div className="right">
            {renderInvitationStatus(owner, invitationDetails, idx)}
            <div className="flex-gap ml-3">
              <Button
                iconOnly
                className="action-icon p-0"
                onClick={() => handleEditName(name, owner)}
              >
                <Img src={EditIcon} alt="edit" width="12" />
              </Button>
              <Button
                iconOnly
                className="action-icon p-0 ml-3"
                onClick={() => {}}
              >
                <Img src={ReplaceIcon} alt="replace" width="12" />
              </Button>
              <Button
                iconOnly
                className="action-icon p-0 ml-3"
                onClick={() => {}}
              >
                <Img src={DeleteIcon} alt="delete" width="12" />
              </Button>
            </div>
          </div>
        </OwnerDetails>
      </React.Fragment>
    );
  };

  const renderInviteOwners = () => {
    return (
      <React.Fragment>
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
            renderOwnerDetails(ownerDetails, idx, true)
          )}
        {!loading &&
          members &&
          members.map((ownerDetails, idx) =>
            renderOwnerDetails(ownerDetails, idx, false)
          )}
        <EditOwnerModal />
      </React.Fragment>
    );
  };

  return (
    <div>
      <InfoCard className="mt-5">
        <div>
          <div className="title">Manage Safe Owners</div>
          <div className="subtitle">
            Add, remove and replace owners or rename existing owners.
          </div>
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
