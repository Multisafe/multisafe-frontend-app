import styled from "styled-components/macro";
import { Card } from "components/common/Card";

export default styled(Card)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 10rem;

  .title {
    margin-bottom: 1rem;
    font-size: 1.6rem;
    font-weight: 900;
    text-align: left;
    color: #373737;
  }

  .subtitle {
    font-size: 1.4rem;
    font-weight: normal;
    text-align: left;
    color: #373737;
  }

  .flex {
    display: flex;
    align-items: center;
  }

  .help {
    display: flex;
    padding: 0;
    align-items: center;
    min-height: 0;

    .text {
      border-bottom: solid 0.1rem #7367f0;
      align-items: center;
      font-size: 1.2rem;
      font-weight: 900;
      text-align: left;
      color: #7367f0;
    }

    &:hover {
      opacity: 0.8;
    }
  }

  @media (max-width: 978px) {
    height: auto;
    flex-wrap: wrap;
    grid-gap: 1rem 0;
    .flex {
      margin-top: 1rem;
      flex-wrap: wrap;
    }
  }
`;
