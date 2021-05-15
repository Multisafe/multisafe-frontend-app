import React, { lazy, Suspense } from "react";
import LoadingIndicator from "components/common/Loading/PageLoader";

const loadable = (
  importFunc,
  { fallback = LoadingIndicator } = { fallback: null }
) => {
  const LazyComponent = lazy(importFunc);

  return (props) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

export default loadable;
