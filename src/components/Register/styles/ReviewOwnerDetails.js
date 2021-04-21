import styled from "styled-components/macro";

export default styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  border: solid 1px rgba(168, 168, 168, 0.5);
  background-color: #ffffff;

  .owner-card {
    min-width: 400px;
    max-width: 100%;
    flex-grow: 0;
    padding: 15px;
    display: flex;
    align-items: center;
    border-bottom: solid 1px rgba(168, 168, 168, 0.5);
    &:last-child {
      border-bottom: none;
    }
    .owner-name {
      margin-left: 17px;
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: left;
      color: #373737;
      margin-bottom: 5px;
    }
    .owner-address {
      margin-left: 17px;
      font-size: 12px;
      font-weight: 300;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: left;
      color: #373737;
    }
  }
`;
