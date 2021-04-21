import styled from "styled-components/macro";

export default styled.tbody`
  position: relative;

  width: 100%;

  tr {
    font-size: 1.4rem;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
    color: #373737;
    background-color: #ffffff;
    padding: 1.5rem;

    &:hover {
      background-color: #f1f0fd;
      cursor: pointer;
    }
  }

  td {
    height: 5rem;
  }

  td:first-child {
    padding-left: 4rem;
  }
  td:last-child {
    padding-right: 4rem;
  }

  tr {
    border-bottom: 0.1rem solid rgba(221, 220, 220, 0.8);
  }

  tr:last-child {
    border-bottom: none;
  }

  @media (max-width: 600px) {
    td:first-child {
      padding-left: 1rem;
    }
    td:last-child {
      padding-right: 1rem;
    }
  }
`;
