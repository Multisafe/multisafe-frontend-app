import styled from "styled-components/macro";

export default styled.div`
  width: 100%;
  min-height: 75px;
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 12px 0;
  box-shadow: 0 -3px 3px 0 rgba(0, 0, 0, 0.06);
  background-color: #ffffff;

  .buttons {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .approve-button {
    width: 400px;
    margin-right: 10px;
  }
  .reject-button {
    width: 400px;
    margin-right: 10px;
    button {
      background-color: #ff0a0a;
    }
  }
`;
