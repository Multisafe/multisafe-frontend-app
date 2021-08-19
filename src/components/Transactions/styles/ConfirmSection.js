import styled from "styled-components/macro";

export default styled.div`
  width: 100%;
  min-height: 8rem;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 2rem 0;
  border-top: solid 0.1rem #dddcdc;
  background-color: #ffffff;

  .buttons {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .approve-button {
    margin-right: 2rem;
    button {
      box-shadow: 1rem 1rem 2rem 0 rgba(35, 30, 79, 0.15);
    }
  }
  .reject-button {
    button {
      box-shadow: 1rem 1rem 2rem 0 rgba(35, 30, 79, 0.15);
      background-color: #ff4660;
    }
  }
`;
