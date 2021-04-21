import styled from "styled-components/macro";

export default styled.div`
  width: 100%;
  min-height: 62px;
  padding: 21px;
  border-radius: 12px;
  background-color: #f2f2f2;
  flex-wrap: wrap;

  display: flex;
  justify-content: space-between;
  flex-direction: column;

  .step-title {
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.29;
    letter-spacing: normal;
    text-align: left;
    color: #373737;
  }

  .step-subtitle {
    font-size: 14px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.29;
    letter-spacing: normal;
    text-align: left;
    color: #373737;
  }
`;
