import React from "react";
import { isEmpty, get } from "lodash";

import { Error } from "./styles";

const ErrorMessage = ({ errors, name, ...rest }) => {
  if (isEmpty(errors)) return null;
  return (
    <>
      {errors[name] ? (
        <Error {...rest}>
          {errors[name].message || "Please check your input"}
        </Error>
      ) : get(errors, name) ? (
        <Error {...rest}>{get(errors, name)}</Error>
      ) : null}
    </>
  );
};

export default ErrorMessage;
