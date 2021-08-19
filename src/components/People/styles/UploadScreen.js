import styled from "styled-components/macro";

export default styled.div`
  padding: 3rem 5rem;

  .format-csv {
    font-size: 1.2rem;
    font-weight: 900;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
    color: ${({ theme }) => theme.primary};
  }

  .text {
    font-size: 1.4rem;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
    color: #373737;
  }

  .points-to-remember {
    .title {
      font-size: 1.2rem;
      font-weight: 900;
      text-align: left;
      color: #373737;
      margin: 2rem 0 1rem;
    }

    .points {
      list-style: none;
      padding: 0 1.4rem;

      li {
        font-size: 1.2rem;
        font-weight: normal;
        text-align: left;
        color: #373737;
        padding-bottom: 0.5rem;
        display: flex;
        align-items: center;

        &::before {
          display: flex;
          align-items: center;
          justify-content: center;
          content: "•";
          color: #dddcdc;
          font-weight: bold;
          display: inline-block;
          width: 1em;
          margin-left: -1em;
          margin-right: 0.5rem;
          font-size: 16px;
        }
      }
    }
  }
`;
