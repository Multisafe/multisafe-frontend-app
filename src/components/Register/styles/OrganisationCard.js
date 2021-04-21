import styled from "styled-components/macro";

export default styled.div`
  width: 285px;
  height: 250px;
  position: relative;

  background: #ffffff;
  border: 1px solid rgba(115, 103, 240, 0.54);
  box-sizing: border-box;
  border-radius: 8px;

  .org-title {
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 20px;
    display: flex;
    align-items: center;
    color: #7367f0;
  }

  .org-subtitle {
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 15px;
    display: flex;
    align-items: center;
    color: #373737;
    margin-top: 5px;
  }

  .select-org {
    display: none;
  }

  &:hover {
    .select-org {
      cursor: pointer;
      background: transparent;
      display: block;
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 40px;
      background-color: ${({ theme }) => theme.primary};
      border-radius: 0 0 7px 7px;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: width 1s linear;
    }
  }
`;
