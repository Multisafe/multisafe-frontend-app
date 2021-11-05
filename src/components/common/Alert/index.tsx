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
  padding: 2.2rem 2rem;
  border-radius: 0.4rem;
  background-color: rgba(245, 133, 32, 0.1);
  font-size: 1.4rem;

  @media (min-width: 978px) {
    padding: 2.2rem 3rem;
  }
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
  text-align: center;
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

export const AlertMessage = ({ children }: Props) => {
  return <StyledMessage>{children}</StyledMessage>;
};
