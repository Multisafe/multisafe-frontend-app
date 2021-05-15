import React from "react";
import loadable from "utils/loadable";
import LoadingIndicator from "components/common/Loading/PageLoader";

export default loadable(() => import("./index"), {
  fallback: <LoadingIndicator />,
});
