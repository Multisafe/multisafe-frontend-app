import styled from "styled-components/macro";

export default styled.div`
  width: 100%;
  min-height: 15rem;
  border-radius: 1.6rem;
  border: solid 0.05rem #aaaaaa;
  background-color: #ffffff;
  position: relative;
  color: #363537;
  margin: 3.2rem 0;
  cursor: pointer;

  .select-safe {
    display: none;
  }

  .top {
    border-bottom: solid 0.05rem #aaaaaa;
    padding: 2rem 3.5rem;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .bottom {
    padding: 2rem 3.5rem;
    display: flex;
    justify-content: flex-start;
  }

  .details {
    width: 100%;
    display: flex;
    align-items: center;
  }

  .info {
    margin-left: 1rem;
    width: 100%;

    .desc {
      font-size: 1.4rem;
      font-weight: 500;
      color: #aaaaaa;
      text-transform: uppercase;
    }

    .val {
      font-size: 1.6rem;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.2;
      color: #373737;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  
  .network {
    color: #aaaaaa;
    font-weight: normal;
  }

  &:hover {
    .select-safe {
      background: transparent;
      display: block;
      position: absolute;
      right: 0;
      top: 0;
      width: 5.6rem;
      height: 100%;
      background-color: ${({ theme }) => theme.primary};
      border-radius: 0 1.5rem 1.5rem 0;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: width 1s linear;
    }
  }
`;

export const InfoContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

export const NetworkLabelContainer = styled.div`
  padding-left: 1rem;
  border-left: 0.1rem solid #ccc;  
`;
