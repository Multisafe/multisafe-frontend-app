import styled from "styled-components/macro";

export default styled.div`
  .popup-title {
    font-size: 1.6rem;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
    color: ${({ theme }) => theme.primary};
  }

  .popup-subtitle {
    font-size: 1.2rem;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
    color: #373737;
    margin-top: 0.5rem;
  }

  .popup-list {
    list-style: none;
    padding-left: 1.5rem;

    li {
      font-size: 1.2rem;
      font-weight: 300;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: left;
      color: #373737;
      padding-bottom: 1.5rem;

      &::before {
        content: "•";
        color: ${({ theme }) => theme.primary};
        font-weight: bold;
        display: inline-block;
        width: 1.6rem;
        font-size: 1.6rem;
        margin-left: -1.6rem;
      }
    }

    .bold {
      font-weight: 500;
    }
  }
`;
