import styled from "styled-components/macro";

export default styled.div`
  display: flex;
  align-items: center;
  color: ${({ active }) => (active ? "#1452f5" : "#aaaaaa")};

  .step-check {
    margin-right: 0.5rem;
  }

  .step-text {
    font-size: 1.6rem;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
    color: ${({ active }) => (active ? "#373737" : "#aaaaaa")};
  }
  .step-dash {
    width: 5.5rem;
    height: 0.2rem;
    flex-grow: 0;
    margin: 0.9rem 1.5rem;
    background-color: ${({ active }) => (active ? "#1452f5" : "#aaaaaa")};
  }
`;
