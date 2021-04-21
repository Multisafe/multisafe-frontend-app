import styled from "styled-components/macro";

export default styled.div`
  min-height: 254px;
  margin: 20px 0 0;
  border-radius: 8px;
  border: solid 1px #f2f2f2;

  .grid-two {
    display: grid;
    grid-template-columns: auto auto;
  }

  .detail {
    padding: 24px;

    &.b-right {
      border-right: solid 1px #f2f2f2;
    }
    &.b-bottom {
      border-bottom: solid 1px #f2f2f2;
    }

    .title {
      font-size: 12px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.25;
      letter-spacing: normal;
      text-align: left;
      color: #8b8b8b;
      text-transform: uppercase;
    }

    .desc {
      font-size: 16px;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.19;
      letter-spacing: normal;
      text-align: left;
      color: #373737;
      margin-top: 6px;
    }
  }

  a {
    color: ${({ theme }) => theme.secondary};
  }
`;
