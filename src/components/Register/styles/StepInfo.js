import styled from "styled-components/macro";

export default styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: solid 1px rgba(170, 170, 170, 0.2);
  border-bottom: solid 1px rgba(170, 170, 170, 0.2);
  min-height: 110px;

  .title {
    padding: 10px 36px 0;
    font-size: 20px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.2;
    letter-spacing: normal;
    text-align: left;
    color: #373737;
  }

  .next {
    padding: 10px 36px;
    font-size: 16px;
    font-weight: 300;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.19;
    letter-spacing: normal;
    text-align: left;
    color: #373737;
  }

  .step-progress {
    padding: 10px 36px;
  }
`;
