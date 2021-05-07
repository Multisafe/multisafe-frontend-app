import styled from "styled-components/macro";

export default styled.div`
  min-height: 6rem;
  background-color: ${({ theme, white }) => (white ? "#fff" : theme.primary)};

  box-shadow: ${({ white }) =>
    white ? "0 0.4rem 0.4rem 0 rgba(0, 0, 0, 0.15);" : "none"};
  color: #fff;
  border-bottom: solid 0.1rem rgba(255, 255, 255, 0.2);
`;
