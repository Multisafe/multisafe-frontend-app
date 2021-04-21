import styled from "styled-components/macro";

export default styled.div`
  min-height: 4rem;
  padding: 0 1.2rem;
  border-radius: 0.4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  min-width: 8rem;
  background-color: #f1f0fd;

  &:hover {
    opacity: 0.8;
  }

  .text {
    font-size: 1.4rem;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
    color: #373737;
    padding-top: 0.1rem;
  }
`;
