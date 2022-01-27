import { useActiveWeb3React } from "hooks";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import StreamUITrial from "./trial";

export default function StreamUI() {
  const { library, account } = useActiveWeb3React();

  return (
    <>
      <div
        style={{ fontSize: 16, display: "flex", flexDirection: "row", gap: 36 }}
      >
        {account || "loading..."}
      </div>

      <StreamUITrial />
    </>
  );
}
