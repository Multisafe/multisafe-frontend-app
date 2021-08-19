import styled from "styled-components/macro";

export default styled.div`
  min-height: 4rem;
  margin-right: 2rem;
  padding: 0 1.2rem;
  border-radius: 0.4rem;
  background-color: ${({ theme }) => theme.primary};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  min-width: 14rem;

  .text {
    font-size: 1.4rem;
    font-weight: 900;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
    color: #ffffff;
    padding-top: 0.1rem;
  }

  @media (max-width: 978px) {
    margin-bottom: 1rem;
  }
`;
