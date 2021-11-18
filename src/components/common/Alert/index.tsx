import React, { ReactNode } from "react";
import styled from "styled-components";
import CloseIcon from "assets/icons/dashboard/close-icon.svg";
import Img from "components/common/Img";

type Props = {
  onClose?: () => void;
  children: ReactNode;
};

const StyledAlert = styled.div`
  position: relative;
  padding: 1.5rem;
  background: rgba(249, 168, 47, 0.1);
  border: 0.1rem solid rgba(249, 168, 47, 0.4);
  border-radius: 0.2rem;
  font-size: 1.4rem;
`;

const CloseAlert = styled(Img)`
  position: absolute;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);

  &:hover {
    cursor: pointer;
  }

  @media (min-width: 978px) {
    right: 3rem;
  }
`;

const StyledMessage = styled.div`
  margin: auto;
  max-width: 100rem;
`;

export const Alert = ({ onClose, children, ...rest }: Props) => {
  return (
    <StyledAlert {...rest}>
      <AlertMessage>{children}</AlertMessage>
      {onClose ? (
        <CloseAlert
          src={CloseIcon}
          alt="close-exchange-alert"
          onClick={onClose}
        />
      ) : null}
    </StyledAlert>
  );
};

export const AlertMessage = ({ children, ...rest }: Props) => {
  return <StyledMessage {...rest}>{children}</StyledMessage>;
};
