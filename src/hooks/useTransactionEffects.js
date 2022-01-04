import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { show } from "redux-modal";

import {
  // addTransaction,
  clearTransactionHash,
} from "store/transactions/actions";
import safeReducer from "store/safe/reducer";
import safeSaga from "store/safe/saga";
import { getNonce } from "store/safe/actions";
import { makeSelectNonce } from "store/safe/selectors";
import { createMultisigTransaction } from "store/multisig/actions";
import multisigSaga from "store/multisig/saga";
import multisigReducer from "store/multisig/reducer";
import metaTxReducer from "store/metatx/reducer";
import metaTxSaga from "store/metatx/saga";
import { getMetaTxEnabled } from "store/metatx/actions";
import transactionsReducer from "store/transactions/reducer";
import transactionsSaga from "store/transactions/saga";
import {
  makeSelectMetaTransactionHash,
  makeSelectTransactionId as makeSelectSingleOwnerTransactionId,
} from "store/transactions/selectors";
import { MODAL_NAME as TX_SUBMITTED_MODAL } from "components/NewTransfer/TransactionSubmittedModal";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import { useActiveWeb3React } from "hooks";

// reducer/saga keys
const transactionsKey = "transactions";
const safeKey = "safe";
const multisigKey = "multisig";
const metaTxKey = "metatx";

export default function useTransactionEffects({
  txHash,
  txData,
  baseRequestBody,
}) {
  const [metaTxHash, setMetaTxHash] = useState();
  const { chainId } = useActiveWeb3React();

  // Reducers
  useInjectReducer({ key: transactionsKey, reducer: transactionsReducer });
  useInjectReducer({ key: safeKey, reducer: safeReducer });
  useInjectReducer({ key: multisigKey, reducer: multisigReducer });
  useInjectReducer({ key: metaTxKey, reducer: metaTxReducer });

  // Sagas
  useInjectSaga({ key: transactionsKey, saga: transactionsSaga });
  useInjectSaga({ key: safeKey, saga: safeSaga });
  useInjectSaga({ key: multisigKey, saga: multisigSaga });
  useInjectSaga({ key: metaTxKey, saga: metaTxSaga });

  const dispatch = useDispatch();

  const safeAddress = useSelector(makeSelectOwnerSafeAddress());
  const txHashFromMetaTx = useSelector(makeSelectMetaTransactionHash());
  const singleOwnerTransactionId = useSelector(
    makeSelectSingleOwnerTransactionId()
  );
  const multisigNonce = useSelector(makeSelectNonce());

  useEffect(() => {
    if (safeAddress) {
      dispatch(getNonce({ safeAddress }));
      dispatch(getMetaTxEnabled(safeAddress));
    }
  }, [safeAddress, dispatch, chainId]);

  useEffect(() => {
    if (baseRequestBody) {
      if (txHash) {
        dispatch(
          createMultisigTransaction({
            ...baseRequestBody,
            transactionHash: txHash,
            nonce: multisigNonce,
          })
        );
      } else if (txData) {
        // single owner meta tx or threshold > 0
        dispatch(
          createMultisigTransaction({
            ...baseRequestBody,
            txData,
            nonce: multisigNonce,
          })
        );
      }
    }
  }, [txHash, dispatch, baseRequestBody, txData, multisigNonce]);

  useEffect(() => {
    if (txHashFromMetaTx) {
      setMetaTxHash(txHashFromMetaTx);
      dispatch(clearTransactionHash());
    }
  }, [dispatch, txHashFromMetaTx]);

  useEffect(() => {
    if (metaTxHash && singleOwnerTransactionId) {
      dispatch(
        show(TX_SUBMITTED_MODAL, {
          txHash: metaTxHash,
          selectedCount: 0,
          transactionId: singleOwnerTransactionId,
        })
      );
    }
  }, [dispatch, metaTxHash, singleOwnerTransactionId]);
}
