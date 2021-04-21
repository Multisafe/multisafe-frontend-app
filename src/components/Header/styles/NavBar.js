import styled from "styled-components/macro";

export default styled.div`
  // border-bottom: 1px solid ${({ theme }) => theme.border.color};
  transition: all 0.5s linear;
  height: 8vh;
  min-height: 80px;

  background-color: ${({ theme, white }) => (white ? "#fff" : theme.primary)};

  box-shadow: ${({ white }) =>
    white ? "0 4px 4px 0 rgba(0, 0, 0, 0.15);" : "none"};
  color: #fff;
  border-bottom: solid 1px rgba(255, 255, 255, 0.2);
`;
