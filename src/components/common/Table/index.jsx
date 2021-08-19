import React from "react";
import Loading from "../Loading";
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
    <TableTitle>
      <td colSpan={42} {...rest}>
        {children}
      </td>
    </TableTitle>
  );
}

function CustomTableInfo({ children, ...rest }) {
  return <TableInfo {...rest}>{children}</TableInfo>;
}

function TableLoader({ height, colSpan, ...rest }) {
  return (
    <TableInfo
      style={{
        textAlign: "center",
        height: height || "40rem",
      }}
      {...rest}
    >
      <td colSpan={colSpan}>
        <div className="d-flex align-items-center justify-content-center">
          <Loading color="primary" width="3rem" height="3rem" />
        </div>
      </td>
    </TableInfo>
  );
}

export {
  CustomTable as Table,
  CustomTableHead as TableHead,
  CustomTableBody as TableBody,
  CustomTableTitle as TableTitle,
  CustomTableInfo as TableInfo,
  TableLoader,
};
