import React from "react";

type Props = {
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
  width?: number | string;
  height?: number | string;
};
// Renders an image, enforcing the usage of the alt="" tag
function Img({ src, alt, className = "", ...rest }: Props) {
  return <img className={className} src={src} alt={alt} {...rest} />;
}

export default Img;
