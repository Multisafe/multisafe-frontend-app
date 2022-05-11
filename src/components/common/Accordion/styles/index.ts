import styled from "styled-components/macro";

export const Container = styled.div``;

export const Item = styled.div`
  margin-top: 3rem;
  background: #ffffff;
  border: 0.1rem solid rgba(221, 220, 220, 0.5);
  box-shadow: 1rem 1rem 2rem rgba(178, 178, 178, 0.1);
  border-radius: 0.4rem;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  font-style: normal;
  font-weight: bold;
  font-size: 2rem;
  padding: 2.6rem 3rem;
  cursor: pointer;
`;

export const Body = styled.div<{ toggle: boolean }>`
  overflow-y: hidden;
  max-height: ${({ toggle }) => (toggle ? "300rem" : "0")};
  overflow-y: auto;
  transition: max-height 0.1s ease-in-out;
`;

export const ArrowImg = styled.img<{ toggle: boolean }>`
  transform: rotate(${({ toggle }) => (toggle ? "180deg" : "0deg")});
  transition: transform 0.1s;
`;
