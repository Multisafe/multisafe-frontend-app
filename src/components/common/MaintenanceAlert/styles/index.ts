import styled from "styled-components/macro";

export const AlertContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 6rem;
  background: #f3f6fe;
  box-shadow: -0.5rem -0.5rem 1rem rgba(0, 0, 0, 0.02);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4rem;

  @media (max-width: 600px) {
    height: auto;
    padding: 1rem;
  }
`;

export const AlertText = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 1.6rem;
  color: ${({ theme }) => theme.secondary};
  @media (max-width: 600px) {
    font-size: 1.2rem;
  }
`;

export const AlertFlex = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const AlertReadMore = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 1.6rem;
  margin-left: 1rem;
  border-bottom: 0.1rem solid ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.primary};
  &:hover {
    opacity: 0.7;
  }

  @media (max-width: 600px) {
    font-size: 1.2rem;
  }
`;
