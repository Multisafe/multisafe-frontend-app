import React from "react";
import Img from "components/common/Img";

import { Background } from "./styles";

export default function NotFound() {
  return (
    <Background>
      <Img
        src={"https://images.multisafe.finance/landing-page/not-found.png"}
        alt="not found"
        width="430px"
      />
      <div className="title">404</div>
      <div className="subtitle">Page Not Found</div>
    </Background>
  );
}
