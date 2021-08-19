import styled from "styled-components/macro";

export default styled.div`
  width: 28rem;
  height: 25rem;
  position: relative;
  cursor: pointer;

  background: #ffffff;
  border: 0.1rem solid rgba(115, 103, 240, 0.54);
  box-sizing: border-box;
  border-radius: 0.8rem;

  .org-title {
    font-style: normal;
    font-weight: 600;
    font-size: 1.6rem;
    line-height: normal;
    display: flex;
    align-items: center;
    color: ${({ theme }) => theme.primary};
  }

  .org-subtitle {
    font-style: normal;
    font-weight: normal;
    font-size: 1.2rem;
    line-height: normal;
    display: flex;
    align-items: center;
    color: #373737;
    margin-top: 0.5rem;
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
      height: 4rem;
      background-color: ${({ theme }) => theme.primary};
      border-radius: 0 0 0.7rem 0.7rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: width 1s linear;
    }
  }
`;
