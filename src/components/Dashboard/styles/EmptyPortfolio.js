import styled from "styled-components/macro";

export default styled.div`
  width: 100%;
  padding: 0 1rem;

  .line {
    height: 0.2rem;
    margin: 1rem 0;
    background-color: rgba(221, 220, 220, 0.5);
    -webkit-animation: line 0.75s 1 forwards;
    animation: line 0.75s 1 forwards;
  }

  @-webkit-keyframes line {
    0% {
      width: 0;
    }
    100% {
      width: 100%;
    }
  }
  @keyframes line {
    0% {
      width: 0;
    }
    100% {
      width: 100%;
    }
  }
`;
