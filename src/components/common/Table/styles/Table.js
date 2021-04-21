import styled from "styled-components/macro";

export default styled.table`
  position: relative;
  width: 100%;
  table-layout: fixed;

  td {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (max-width: 600px) {
    td,
    th {
      font-size: 1.1rem !important;
    }
  }
`;
