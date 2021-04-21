import styled from "styled-components/macro";

export default styled.thead`
  width: 100%;
  background-color: #f1f0fd;

  th {
    height: 5rem;
    font-size: 1.4rem;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
    color: #373737;
  }

  th:first-child {
    padding-left: 4rem;
  }
  th:last-child {
    padding-right: 4rem;
  }

  @media (max-width: 600px) {
    th:first-child {
      padding-left: 1rem;
    }
    th:last-child {
      padding-right: 1rem;
    }
  }
`;
