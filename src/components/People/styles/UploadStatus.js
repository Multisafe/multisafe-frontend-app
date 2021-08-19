import styled from "styled-components/macro";

export default styled.div`
  .status {
    height: 16rem;
    padding: 2rem 0;
    border-radius: 0.4rem;
    background-color: rgba(221, 220, 220, 0.4);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .success,
    .fail {
      font-size: 1.4rem;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: center;
      margin: 2rem auto 0;
    }

    .success {
      color: #6cb44c;
    }

    .fail {
      color: #ff4660;
    }

    .file-name {
      font-size: 1.4rem;
      font-weight: 500;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: center;
      color: #373737;
      margin: 1rem auto;
    }

    .remove-file {
      font-size: 1.2rem;
      font-weight: 900;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: center;
      color: #aaaaaa;
      cursor: pointer;
    }
  }

  .csv-title {
    font-size: 2.2rem;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
    color: #373737;
    padding: 3rem 2rem;
  }
`;
