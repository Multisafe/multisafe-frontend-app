import { Link } from "react-router-dom";

import { Button } from "./styles";
import LoadingSvg from "assets/icons/loading.svg";

const CustomButton = ({
  children,
  className,
  width,
  to,
  href,
  iconOnly,
  loading,
  style: propStyles = {},
  ...rest
}) => {
  if (iconOnly) {
    if (to) {
      return (
        <Button
          className={className}
          width={width}
          style={{ border: "none", background: "none", ...propStyles }}
          {...rest}
        >
          <Link to={to}>{children}</Link>
        </Button>
      );
    }
    return (
      <Button
        className={className}
        width={width}
        style={{ border: "none", background: "none", ...propStyles }}
        {...rest}
      >
        {children}
      </Button>
    );
  }

  if (to) {
    return (
      <Link to={to}>
        <Button
          className={className}
          width={width}
          style={propStyles}
          {...rest}
        >
          {children}
        </Button>
      </Link>
    );
  } else if (href) {
    return (
      <a href={href} rel="noopenner noreferrer" target="_blank">
        <Button
          className={className}
          width={width}
          style={propStyles}
          {...rest}
        >
          {children}
        </Button>
      </a>
    );
  }

  return (
    <Button
      className={`d-flex align-items-center justify-content-center ${className}`}
      width={width}
      style={propStyles}
      {...rest}
    >
      {children}
      {loading && (
        <img src={LoadingSvg} alt="loading" width="16" className="ml-2" />
      )}
    </Button>
  );
};

export default CustomButton;
