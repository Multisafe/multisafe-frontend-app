import styled from "styled-components/macro";

export default styled.button`
  background: #fff;
  width: 100%;
  min-height: 120px;
  border-radius: 8px;
  border: solid 0.5px ${({ theme }) => theme.primary};
  padding: 0;
  margin: 20px auto 10px;

  &:hover {
    cursor: pointer;
  }

  .upper,
  .lower {
    padding: 16px;
  }

  .choose-title {
    margin: 8px;
    font-size: 16px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.19;
    letter-spacing: normal;
    text-align: left;
    color: #373737;
  }
  .choose-subtitle {
    max-width: 250px;
    font-size: 14px;
    font-weight: 300;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.29;
    letter-spacing: normal;
    text-align: left;
    color: #373737;
  }

  .line {
    width: 100%;
    height: 0;
    border: solid 1px #f2f2f2;
  }
`;
