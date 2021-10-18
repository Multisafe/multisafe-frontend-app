import React, { ReactNode } from "react";
import { createPortal } from "react-dom";
import { slide as Menu, Props as MenuProps, State } from "react-burger-menu";
import styled from "styled-components";
import CloseIcon from "assets/icons/navbar/close.svg";
import Img from "components/common/Img";
import { PORTAL_CONTAINER_ID } from "components/common/PortalContainer";

const styles = {
  bmMenuWrap: {
    position: "fixed",
    height: "100%",
    top: "0",
  },
  bmMenu: {
    background: "#fff"
  },
  bmMorphShape: {
    fill: "#fff",
  },
  bmItemList: {
    color: "#373737",
  },
  bmOverlay: {
    background: "rgba(0, 0, 0, 0.05)",
    top: "0",
  },
};

type Props = {
  children: ReactNode;
  header: ReactNode;
  onClose: () => void;
} & MenuProps;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 2rem 3rem;
  background-color: ${({ theme }) => theme.accent};
  font-size: 1.6rem;
  font-weight: 900;
`;

const CloseIconButton = styled(Img)`
  cursor: pointer;
`;

const portalContainer = document.getElementById(PORTAL_CONTAINER_ID);

export const SideDrawer = (props: Props) => {
  const { children, header, onClose, ...rest } = props;

  const onStateChange = ({ isOpen }: State) => {
    if (!isOpen) {
      onClose();
    }
  };

  return portalContainer
    ? createPortal(
        <Menu
          {...{
            styles,
            itemListElement: "div",
            customBurgerIcon: false,
            customCrossIcon: false,
            disableAutoFocus: true,
            onStateChange,
            ...rest,
          }}
        >
          <div>
            <Header>
              <div>{header}</div>
              <CloseIconButton
                onClick={onClose}
                src={CloseIcon}
                alt="close-side-drawer"
              />
            </Header>
            <div>{children}</div>
          </div>
        </Menu>,
        portalContainer
      )
    : null;
};
