import React, { memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { show } from "redux-modal";

// import { useInjectSaga } from "utils/injectSaga";
// import { useInjectReducer } from "utils/injectReducer";
import Img from "components/common/Img";
// import Loading from "components/common/Loading";
import CloseIcon from "assets/icons/navbar/close.svg";
import {
  makeSelectIsPeopleDetailsOpen,
  makeSelectPeopleDetails,
} from "store/layout/selectors";
import { togglePeopleDetails } from "store/layout/actions";
import Avatar from "components/common/Avatar";
import CopyButton from "components/common/Copy";

import { PeopleDetails } from "./styles";
import EtherscanLink from "components/common/EtherscanLink";
import Button from "components/common/Button";
import { MODAL_NAME as DELETE_PEOPLE_MODAL } from "./DeletePeopleModal";

const sidebarStyles = {
  bmCrossButton: {
    height: "24px",
    width: "24px",
  },
  bmMenuWrap: {
    position: "fixed",
    height: "100%",
    top: "0",
    zIndex: "20",
  },
  bmMenu: {
    background: "#fff",
    fontSize: "1.15em",
  },
  bmMorphShape: {
    fill: "#fff",
  },
  bmItemList: {
    color: "#373737",
  },
  bmItem: {
    // display: "flex",
  },
  bmOverlay: {
    background: "rgba(0, 0, 0, 0.05)",
    top: "0",
    zIndex: "10",
  },
};

function PeopleDetailsSidebar() {
  const isPeopleDetailsOpen = useSelector(makeSelectIsPeopleDetailsOpen());
  const peopleDetails = useSelector(makeSelectPeopleDetails());

  const dispatch = useDispatch();

  const handleStateChange = (state) => {
    dispatch(togglePeopleDetails(state.isOpen));
  };

  const closeSidebar = () => {
    dispatch(togglePeopleDetails(false));
  };

  const handleDelete = () => {
    dispatch(show(DELETE_PEOPLE_MODAL, { peopleId: peopleDetails.peopleId }));
  };

  const renderInfo = () => {
    if (!peopleDetails) return;
    const {
      firstName,
      lastName,
      departmentName,
      // departmentId,
      // peopleId,
      salaryAmount,
      salaryToken,
      address,
    } = peopleDetails;

    return (
      <div className="details">
        <div className="detail">
          <div className="title">Name</div>
          <div className="subtitle">
            <Avatar
              className="mr-3"
              firstName={firstName}
              lastName={lastName}
            />{" "}
            <div>
              {firstName} {lastName}
            </div>
          </div>
        </div>
        <div className="detail">
          <div className="title">Team</div>
          <div className="subtitle">
            <div>{departmentName}</div>
          </div>
        </div>
        <div className="detail">
          <div className="title">Pay Amount</div>
          <div className="subtitle">
            <div>
              {salaryAmount} {salaryToken}
            </div>
          </div>
        </div>
        <div className="detail">
          <div className="title">Wallet Address</div>
          <div className="subtitle">
            <div>{address}</div>
          </div>
          <div className="icons">
            <CopyButton
              id="address"
              tooltip="address"
              value={address}
              className="mr-3"
            />
            <EtherscanLink
              id="etherscan-link"
              type="address"
              address={address}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <PeopleDetails
      styles={sidebarStyles}
      right
      customBurgerIcon={false}
      customCrossIcon={false}
      disableAutoFocus
      isOpen={isPeopleDetailsOpen}
      onStateChange={(state) => handleStateChange(state)}
      width={380}
    >
      <div className="people-details-header">
        <div className="title">Person Details</div>
        <div className="close" onClick={closeSidebar}>
          <Img src={CloseIcon} alt="close" />
        </div>
      </div>
      {renderInfo()}
      <div className="modify-buttons">
        <Button className="mr-3" width={"10rem"}>
          Edit
        </Button>
        <Button className="secondary-2" width={"10rem"} onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </PeopleDetails>
  );
}

export default memo(PeopleDetailsSidebar);
