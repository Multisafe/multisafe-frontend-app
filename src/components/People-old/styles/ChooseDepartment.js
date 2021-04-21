import styled from "styled-components/macro";

export default styled.button`
  background: #fff;
  width: 100%;
  padding: 16px;
  border-radius: 8px;
  border: solid 0.5px ${({ theme }) => theme.primary};
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    cursor: pointer;
  }

  .choose-title {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.19;
    letter-spacing: normal;
    text-align: left;
    color: ${({ theme }) => theme.primary};
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
`;
