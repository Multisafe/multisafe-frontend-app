import React from "react";
import Img from "components/common/Img";
import NotFoundImg from "assets/images/not-found.png";

import { Background } from "./styles";

export default function NotFound() {
  return (
    <Background>
      <Img src={NotFoundImg} alt="not found" width="430" />
      <div className="title">404</div>
      <div className="subtitle">Page Not Found</div>
    </Background>
  );
}
