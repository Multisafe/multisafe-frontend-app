import React from "react";
import Loading from "./index";

export default function PageLoader() {
  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ height: "80vh" }}
    >
      <Loading color="primary" width="3rem" height="3rem" />
    </div>
  );
}
