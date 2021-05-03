import React from "react";

const ErrorText = ({ children }) => {
  return (
    <div className="text-green my-3" style={{ fontSize: "1.4rem" }}>
      {children}
    </div>
  );
};

export default ErrorText;
