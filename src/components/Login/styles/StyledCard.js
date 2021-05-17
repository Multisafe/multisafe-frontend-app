import styled from "styled-components/macro";
import { Card } from "components/common/Card";

export default styled(Card)`
  margin: auto;
  padding: 0;
  width: 100%;
  min-height: 60rem;
  margin-bottom: 6rem;

  .back-btn-container {
    display: flex;
    align-items: center;
    padding: 1.6rem 2rem;

    .back-btn {
      font-size: 1.6rem;
      font-weight: 500;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: left;
      color: #373737;
    }
  }
`;
