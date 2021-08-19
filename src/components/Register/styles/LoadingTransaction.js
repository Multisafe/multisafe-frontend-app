import styled from "styled-components/macro";

export default styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .loading-img {
    margin: 50px auto;
  }

  .loading-heading {
    margin: 120px auto 0;
    font-size: 20px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #373737;
    text-align: center;
    animation: flickerAnimation 1.5s infinite;
  }

  .loading-title {
    font-size: 20px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: #373737;
    margin-bottom: 15px;
  }

  .loading-subtitle {
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: #8b8b8b;
  }

  .loading-hash {
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    min-height: 30px;
    a {
      color: ${({ theme }) => theme.primary} !important;
    }
    margin-top: 15px;
  }

  @keyframes flickerAnimation {
    0% {
      opacity: 1;
    }

    50% {
      opacity: 0.6;
    }

    100% {
      opacity: 1;
    }
  }

  @-webkit-keyframes flickerAnimation {
    0% {
      opacity: 1;
    }

    50% {
      opacity: 0.6;
    }

    100% {
      opacity: 1;
    }
  }

  @-moz-keyframes flickerAnimation {
    0% {
      opacity: 1;
    }

    50% {
      opacity: 0.6;
    }

    100% {
      opacity: 1;
    }
  }
`;
