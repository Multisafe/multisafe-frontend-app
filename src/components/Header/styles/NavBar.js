import styled from "styled-components/macro";

export default styled.div`
  min-height: 8rem;
  background-color: ${({ theme, white }) =>
    white ? "#f7f7f7" : theme.primary};

  box-shadow: ${({ white }) =>
    white ? "0 0.05rem 0.05rem 0 rgba(0, 0, 0, 0.15)" : "none"};
  color: #fff;
  border-bottom: solid 0.1rem rgba(255, 255, 255, 0.2);
`;
