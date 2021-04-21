import styled from "styled-components/macro";

export default styled.div`
  width: 100%;
  min-height: 154px;
  margin: 44px auto 20px;
  padding: 30px 24px;
  border-radius: 16px;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.02);
  border: solid 0.5px #5d55a8;
  background-color: ${({ theme }) => theme.primary};

  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  .all-employees-title {
    font-size: 20px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.2;
    letter-spacing: normal;
    text-align: left;
    color: #ffffff;
  }

  .all-employees-subtitle {
    font-size: 16px;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.19;
    letter-spacing: normal;
    text-align: left;
    color: #ffffff;
    font-weight: 300;

    span {
      font-weight: bold;
    }
  }
`;
