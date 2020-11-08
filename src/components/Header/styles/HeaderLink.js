import { Link } from "react-router-dom";
import styled from "styled-components/macro";

export default styled(Link)`
  display: inline-flex;
  padding: 0.25em 0;
  margin: 1em 0;
  text-decoration: none;
  cursor: pointer;
  outline: 0;
  font-family: "Montserrat", sans-serif;
  font-weight: bold;
  font-size: 20px;
  color: ${({ theme }) => theme.logo.color};

  &:active {
    background: none;
    color: #fff;
  }

  &:hover {
    color: ${({ theme }) => theme.logo.color};
    text-decoration: none;
  }
`;
