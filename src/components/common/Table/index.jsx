import React from "react";
import { Table, TableHead, TableBody, TableTitle, TableInfo } from "./styles";

function CustomTable({ children, ...rest }) {
  return <Table {...rest}>{children}</Table>;
}

function CustomTableHead({ children, ...rest }) {
  return <TableHead {...rest}>{children}</TableHead>;
}

function CustomTableBody({ children, ...rest }) {
  return <TableBody {...rest}>{children}</TableBody>;
}

function CustomTableTitle({ children, ...rest }) {
  return (
    <TableTitle {...rest}>
      <td colSpan={42}>{children}</td>
    </TableTitle>
  );
}

function CustomTableInfo({ children, ...rest }) {
  return <TableInfo {...rest}>{children}</TableInfo>;
}

export {
  CustomTable as Table,
  CustomTableHead as TableHead,
  CustomTableBody as TableBody,
  CustomTableTitle as TableTitle,
  CustomTableInfo as TableInfo,
};
