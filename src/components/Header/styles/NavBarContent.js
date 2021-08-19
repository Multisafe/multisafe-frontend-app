import styled from "styled-components/macro";

export default styled.div`
  width: 100%;
  padding: 0 3rem;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 8rem;

  @media (max-width: 600px) {
    flex-direction: column;
    padding: 1rem;
  }
`;
