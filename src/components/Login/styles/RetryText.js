import styled from "styled-components/macro";

export default styled.p`
  margin-bottom: 1rem;
  font-size: 1.6rem;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  color: ${({ theme }) => theme.primary};
  cursor: pointer;
  position: absolute;
  bottom: 2rem;
  left: 0;
  right: 0;
`;
