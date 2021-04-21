import styled from "styled-components/macro";

const defaultColumns = 5;

export const TableHead = styled.div`
  width: 100%;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.05);
  border: solid 1px #f2f2f2;
  background-color: #ffffff;
  padding: 21px 40px;
  border-radius: 20px 20px 0 0;

  display: grid;
  grid-template-columns: ${({ col }) =>
    `repeat(${col || defaultColumns}, 1fr)`};

  font-size: 14px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.29;
  letter-spacing: normal;
  text-align: left;
  color: #373737;

  &:first-child {
    border-left: none;
  }
  border-left: 1px solid #aaa;
`;

export const TableBody = styled.div`
  width: 100%;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.05);
  border: solid 1px #f2f2f2;
  background-color: #ffffff;
  border-radius: 0 0 20px 20px;
  height: 604px;
  overflow: auto;
`;

export const TableRow = styled.div`
  margin: 16px;
  min-height: 52px;
  padding: 8px 28px;
  border-radius: 8px;
  box-shadow: 0 3px 8px 0 rgba(0, 0, 0, 0.04);
  border: solid 0.5px #f2f2f2;
  background-color: #ffffff;
  display: grid;
  grid-template-columns: ${({ col }) =>
    `repeat(${col || defaultColumns}, 1fr)`};
  align-items: center;

  a {
    color: ${({ theme }) => theme.primary};
  }

  .purple-text {
    font-size: 14px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.29;
    letter-spacing: normal;
    text-align: center;
    color: ${({ theme }) => theme.primary};
    cursor: pointer;
  }

  .text-danger {
    position: relative;
  }

  .text-danger::before {
    content: "";
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #dc3545;
    position: absolute;
    left: -10px;
    top: 35%;
  }
`;

const Table = { TableHead, TableBody, TableRow };
export default Table;
