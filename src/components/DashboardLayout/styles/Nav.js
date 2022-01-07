import styled from "styled-components/macro";

export default styled.div`
  background-color: #f7f7f7;
  align-items: center;
  position: relative;
  

  .nav-icon {
    display: none;
  }

  .nav-container {
    height: 100%;
    padding: 0 2rem;
    display: flex;
    gap: 3rem;
    justify-content: flex-end;
    align-items: center;
    margin-left: auto;
  }

  @media (max-width: 978px) {
    display: flex;
    height: auto;
    
    .nav-icon {
      display: inline;
      padding: 0 1em;
      cursor: pointer;
      margin-left: 1rem;
    }
    
    .nav-container {
      padding: 1rem 0;
      gap: 1rem;
    }
  }

  @media (max-width: 678px) {
    .nav-icon {
      display: inline;
      padding: 0 1em;
      cursor: pointer;
    }

    .nav-container {
      flex-wrap: wrap;
      align-items: flex-end;
    }
  }
`;
