import styled from "styled-components/macro";

export default styled.div`
  .popup-title {
    font-size: 16px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
    color: #7367f0;
  }

  .popup-subtitle {
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
    color: #373737;
    margin-top: 5px;
  }

  .popup-list {
    list-style: none;
    padding-left: 15px;

    li {
      width: 550px;
      font-size: 12px;
      font-weight: 300;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: left;
      color: #373737;
      padding-bottom: 15px;

      &::before {
        content: "•";
        color: #7367f0;
        font-weight: bold;
        display: inline-block;
        width: 1em;
        font-size: 16px;
        margin-left: -1em;
      }
    }

    .bold {
      font-weight: 500;
    }
  }
`;
