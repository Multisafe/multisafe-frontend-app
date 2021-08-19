import styled from "styled-components/macro";

export default styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 10rem;
  gap: 2rem;

  @media (max-width: 978px) {
    height: auto;
    flex-wrap: wrap;
    gap: 1rem 0;
  }
`;
