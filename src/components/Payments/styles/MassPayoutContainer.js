import styled from "styled-components/macro";

export default styled.div`
  padding: 4rem;

  .outer-flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .inner-flex {
    display: flex;
    align-items: center;
  }

  .title {
    font-size: 1.4rem;
    font-weight: 900;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
    color: #373737;
  }

  .select-all {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 3rem;
    font-size: 1.4rem;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
    color: #373737;
  }

  @media (max-width: 978px) {
    padding: 3rem 2rem;
    .outer-flex,
    .inner-flex {
      flex-direction: column;
      grid-gap: 2rem;
      align-items: flex-start;
    }
  }
`;
