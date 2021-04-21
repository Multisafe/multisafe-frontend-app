import styled from "styled-components/macro";

export default styled.div`
  width: 100%;
  padding: 0 1px 0 24px;
  border-radius: 16px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  border: solid 1px #f2f2f2;
  background-color: ${({ theme }) => theme.primary};
  display: flex;
  align-items: center;
  padding: 25px;

  .left {
    width: 35%;
    margin-left: 20px;
  }

  .right {
    .section-title {
      font-size: 12px;
      font-weight: 500;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.25;
      letter-spacing: normal;
      text-align: left;
      color: #ffffff;
    }
    .section-desc {
      font-size: 14px;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.29;
      letter-spacing: normal;
      text-align: left;
      color: #ffffff;
    }
  }
`;
