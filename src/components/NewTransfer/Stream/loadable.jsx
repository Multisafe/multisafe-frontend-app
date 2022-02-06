import LoadingIndicator from "components/common/Loading/PageLoader";
import React from "react";
import loadable from "utils/loadable";

export default loadable(() => import("./index"), {
  fallback: <LoadingIndicator />,
});
