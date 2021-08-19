import styled from "styled-components/macro";

export default styled.div`
  font-size: 1.4rem;
  font-weight: 900;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: ${({ color }) => color || "#373737"};
`;
