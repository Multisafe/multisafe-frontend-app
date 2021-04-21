import styled from "styled-components/macro";

export default styled.div`
  display: flex;
  align-items: center;
  color: ${({ active }) => (active ? "#7367f0" : "#aaaaaa")};

  .step-check {
    margin-right: 5px;
  }

  .step-text {
    font-size: 16px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
    color: ${({ active }) => (active ? "#373737" : "#aaaaaa")};
  }
  .step-dash {
    width: 55px;
    height: 2px;
    flex-grow: 0;
    margin: 9px 15px;
    background-color: ${({ active }) => (active ? "#7367f0" : "#aaaaaa")};
  }
`;
