import React, { memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { show } from "redux-modal";

import Img from "components/common/Img";
import CloseIcon from "assets/icons/navbar/close.svg";
import {
  makeSelectIsPeopleDetailsOpen,
  makeSelectPeopleDetails,
} from "store/layout/selectors";
import { togglePeopleDetails } from "store/layout/actions";
import Avatar from "components/common/Avatar";
import CopyButton from "components/common/Copy";
import {
  makeSelectTokenList,
  makeSelectTokensDetails,
} from "store/tokens/selectors";
import { PeopleDetails } from "./styles";
import BlockExplorerLink from "components/common/BlockExplorerLink";
import Button from "components/common/Button";
import { MODAL_NAME as DELETE_PEOPLE_MODAL } from "./DeletePeopleModal";
import { MODAL_NAME as EDIT_PEOPLE_MODAL } from "./AddSinglePeopleModal";
import { constructLabel } from "utils/tokens";
import { EXPLORER_LINK_TYPES } from "components/common/Web3Utils";
import { formatNumber } from "utils/number-helpers";
import { MODAL_NAME as NEW_TRANSFER_MODAL } from "components/NewTransfer/NewTransferModal";
import { formatText } from "utils/string-utils";

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
  const tokenDetails = useSelector(makeSelectTokensDetails());
  const tokenList = useSelector(makeSelectTokenList());

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

  const handlePayNow = () => {
    const {
      firstName,
      lastName,
      departmentName,
      salaryAmount,
      salaryToken,
      salaryTokenAddress,
      address,
    } = peopleDetails;

    const token =
      salaryToken !== "USD"
        ? tokenList
            .filter((details) => details.name === salaryToken)
            .map((details) => ({
              value: details.address,
              label: constructLabel({
                token: details.name,
                address: details.address,
                component: (
                  <div>
                    {formatNumber(details.balance, 5)} {details.name}
                  </div>
                ),
                imgUrl: details.icon,
              }),
            }))[0]
        : {
            value: tokenList[0].address,
            label: constructLabel({
              token: tokenList[0].name,
              component: (
                <div>
                  {formatNumber(tokenList[0].balance, 5)} {tokenList[0].name}
                </div>
              ),
              imgUrl: tokenList[0].icon,
            }),
          };

    closeSidebar();
    dispatch(
      show(NEW_TRANSFER_MODAL, {
        prefilledValues: {
          batch: [
            {
              token,
              receivers: [
                {
                  name: formatText(`${firstName} ${lastName}`),
                  address,
                  departmentName,
                  isDisabled: 1,
                  tokenValue: salaryToken !== "USD" ? salaryAmount : "",
                  fiatValue: salaryToken === "USD" ? salaryAmount : "",
                  tokenAddress: salaryTokenAddress,
                },
              ],
            },
          ],
        },
      })
    );
  };

  const handleEdit = () => {
    const {
      firstName,
      lastName,
      departmentName,
      departmentId,
      peopleId,
      salaryAmount,
      salaryToken,
      salaryTokenAddress,
      address,
    } = peopleDetails;
    const tokenInfo =
      tokenDetails?.[salaryTokenAddress] ||
      Object.values(tokenDetails).find(({ symbol }) => symbol === salaryToken);

    dispatch(
      show(EDIT_PEOPLE_MODAL, {
        defaultValues: {
          firstName,
          lastName,
          amount: salaryAmount,
          token: {
            value: `${salaryTokenAddress} ${salaryToken}`,
            label: constructLabel({
              token: salaryToken,
              imgUrl: tokenInfo.logoURI,
            }),
          },
          address,
          team: { value: departmentId, label: departmentName },
        },
        isEditMode: true,
        peopleId,
      })
    );
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
              {formatNumber(salaryAmount, 5)} {salaryToken}
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
            <BlockExplorerLink
              id="block-explorer-link"
              type={EXPLORER_LINK_TYPES.ADDRESS}
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
      <div className="pay-button">
        <Button width={"21rem"} onClick={handlePayNow}>
          Pay Now
        </Button>
      </div>
      <div className="modify-buttons">
        <Button className="mr-3" width={"10rem"} onClick={handleEdit}>
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
