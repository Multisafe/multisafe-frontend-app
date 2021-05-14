import styled from "styled-components/macro";

export default styled.div`
  min-height: 4rem;
  margin-right: 3rem;
  padding: 1rem;
  border-radius: 0.4rem;
  background-color: ${({ theme }) => theme.accent};
  display: flex;
  min-width: 16rem;
  justify-content: center;
  align-items: center;

  .text {
    font-size: 1.1rem;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
    color: #373737;
  }

  .connector {
    font-size: 1rem;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
  }

  @media (max-width: 600px) {
    margin-right: 2rem;
    min-width: auto;
  }
`;
