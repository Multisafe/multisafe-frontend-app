import React from "react";

const ErrorText = ({ children }) => {
  return (
    <div className="text-red my-3" style={{ fontSize: "1.4rem" }}>
      <span>Error: </span>
      {children}
    </div>
  );
};

export default ErrorText;
