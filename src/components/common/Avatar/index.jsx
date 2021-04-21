import React from "react";
import { NameAvatar } from "./styles";

export default function Avatar({ firstName, lastName, ...rest }) {
  const renderInitials = () => {
    if (firstName && lastName)
      return `${firstName[0].toUpperCase()}${lastName[0].toUpperCase()}`;
    else if (firstName && !lastName && firstName.length > 2)
      return `${firstName[0].toUpperCase()}${firstName[1].toUpperCase()}`;

    return "XX";
  };
  return <NameAvatar {...rest}>{renderInitials()}</NameAvatar>;
}
