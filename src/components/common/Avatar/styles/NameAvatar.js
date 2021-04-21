import styled from "styled-components/macro";

export default styled.span`
  position: relative;
  border-radius: 50%;
  font-size: 0.8rem;
  font-weight: 900;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: 0.04rem;
  text-align: center;
  color: #000000;
  background-color: #e3e1fc;
  width: 2.2rem;
  height: 2.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 0.1rem;

  @media (max-width: 600px) {
    display: none;
  }
`;
