// import StreamUITrial from "./trial";
import { Button } from "components/common/Button/styles";
import { MODAL_NAME as NEW_TRANSFER_MODAL } from "components/NewTransfer/NewTransferModal";
import { useActiveWeb3React } from "hooks";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { show } from "redux-modal";
// import StreamUITrial from "./trial";

export default function StreamUI(props) {
  const { library, account } = useActiveWeb3React();
  const dispatch = useDispatch();

  useEffect(() => {
    // dispatch(show(NEW_TRANSFER_MODAL));
  }, []);

  const toggleModal = () => dispatch(show(NEW_TRANSFER_MODAL));

  return (
    <>
      <Button onClick={toggleModal}>Toggle new transfer</Button>
      {/* <StreamUITrial /> */}
    </>
  );
}
