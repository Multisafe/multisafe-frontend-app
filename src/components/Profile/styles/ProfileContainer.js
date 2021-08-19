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

  .name-container {
    display: flex;
    align-items: center;
    gap: 1rem;
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
    margin-bottom: 1rem;
  }

  .subtitle {
    font-size: 1.4rem;
    font-weight: normal;
    text-align: left;
    color: #373737;
  }

  .address {
    display: flex;
    align-items-center;
    font-size: 1.4rem;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #989898;
    word-break: break-all;
  }

  .data-sharing {
    font-size: 1.4rem;
    font-weight: normal;
    text-align: left;
    color: #373737;
    display: flex;
    margin-top: 2rem;
  }
`;
