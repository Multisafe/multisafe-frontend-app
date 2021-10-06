import React from "react";
import PropTypes from "prop-types";

// Renders an image, enforcing the usage of the alt="" tag
function Img({ src, alt, className = "", ...rest }) {
  return <img className={className} src={src} alt={alt} {...rest} />;
}

// src and alt enforced by react in dev mode
Img.propTypes = {
  src: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default Img;
