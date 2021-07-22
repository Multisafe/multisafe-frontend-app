import styled from "styled-components/macro";

export default styled.div`
  margin-top: 3rem;
  padding: 3rem;
  border-radius: 0.4rem;
  border: solid 0.1rem #dddcdc;
  background-color: #ffffff;
  gap: 1rem;
  display: flex;
  flex-direction: column;

  .help-container {
    max-width: 80rem;
  }

  .help {
    margin-left: auto;
    margin-bottom: 1rem;
    display: flex;
    padding: 0;
    align-items: center;
    justify-content: flex-end;
    min-height: 0;

    .text {
      border-bottom: solid 0.1rem ${({ theme }) => theme.primary};
      align-items: center;
      font-size: 1.2rem;
      font-weight: 900;
      text-align: left;
      color: ${({ theme }) => theme.primary};
    }

    &:hover {
      opacity: 0.8;
    }
  }
`;
