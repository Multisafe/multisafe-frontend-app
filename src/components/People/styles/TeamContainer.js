import styled from "styled-components/macro";

export default styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  inset: 0 4rem;

  @media (max-width: 600px) {
    inset: 0 1rem;
  }
`;
