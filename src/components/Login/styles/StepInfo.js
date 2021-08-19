import styled from "styled-components/macro";

export default styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: solid 0.1rem rgba(170, 170, 170, 0.2);
  border-bottom: solid 0.1rem rgba(170, 170, 170, 0.2);

  .title {
    padding: 1rem 3.6rem 0;
    font-size: 2rem;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
    color: ${({ theme }) => theme.primary};
  }

  .next {
    padding: 1rem 3.6rem;
    font-size: 1.6rem;
    font-weight: 300;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.19;
    letter-spacing: normal;
    text-align: left;
    color: #373737;
  }

  .step-progress {
    padding: 1rem 3.6rem;
  }
`;
