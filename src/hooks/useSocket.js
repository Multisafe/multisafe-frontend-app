import React, { useCallback, useEffect, useRef } from "react";
import io from "socket.io-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";

import { networkId } from "constants/networks";
import { ROOT_BE_URL } from "constants/endpoints";
import { showToast, toaster } from "components/common/Toast";
import { getTransactionByIdSuccess } from "store/transactions/actions";
import { getMultisigTransactionByIdSuccess } from "store/multisig/actions";
import { getNotificationsSuccess } from "store/notifications/actions";
import { getTokensSuccess } from "store/tokens/actions";
import Button from "components/common/Button";

export default function useSocket(props) {
  const { safeAddress, isMultiOwner } = props;
  const socketRef = useRef();

  const dispatch = useDispatch();

  const showTxConfirmedToast = useCallback(
    (message) => {
      if (!isMultiOwner) {
        toaster.dismiss();
        showToast(
          <div className="d-flex align-items-center">
            <div>
              <FontAwesomeIcon
                className="arrow"
                icon={faCheckCircle}
                color="#3bd800"
                style={{ fontSize: "18px" }}
              />
            </div>
            <div className="ml-3">
              <div>Transaction Confirmed</div>
              <Button
                iconOnly
                to={`/dashboard/transactions/${message.transaction[0].transactionId}`}
                className="p-0 mt-1"
              >
                View Transaction
              </Button>
            </div>
          </div>,
          { toastId: `${message.transaction[0].transactionId}-txConfirmed` }
        );
        // repopulate transaction details
        dispatch(
          getTransactionByIdSuccess(message.transaction[0], message.log)
        );
      } else {
        toaster.dismiss();
        showToast(
          <div className="d-flex align-items-center">
            <div>
              <FontAwesomeIcon
                className="arrow"
                icon={faCheckCircle}
                color="#3bd800"
                style={{ fontSize: "18px" }}
              />
            </div>
            <div className="ml-3">
              <div>Transaction Confirmed</div>
              <Button
                iconOnly
                to={`/dashboard/transactions/${message.transaction.txDetails.transactionId}`}
                className="p-0 mt-1"
              >
                View Transaction
              </Button>
            </div>
          </div>,
          {
            toastId: `${message.transaction.txDetails.transactionId}-txConfirmed`,
          }
        );
        dispatch(
          getMultisigTransactionByIdSuccess(
            message.transaction,
            message.executionAllowed
          )
        );
      }
    },
    [dispatch, isMultiOwner]
  );

  useEffect(() => {
    if (safeAddress) {
      socketRef.current = io.connect(ROOT_BE_URL);

      // txConfirmed
      socketRef.current.on(
        `${safeAddress}_${networkId}_txConfirmed`,
        (message) => {
          showTxConfirmedToast(message);
        }
      );

      // notifications
      socketRef.current.on(
        `${safeAddress}_${networkId}_notifications`,
        (message) => {
          if (
            message.notifications.length > 0 &&
            message.notifications[0].type === 1
          ) {
            const { data } = message.notifications[0];
            dispatch(
              getTokensSuccess(
                data.tokenBalances.tokens,
                data.tokenBalances.prices,
                data.tokenBalances.icons,
                data.tokenBalances.log
              )
            );
          }
          dispatch(
            getNotificationsSuccess(
              message.notifications,
              message.hasSeen,
              message.log
            )
          );
        }
      );
    }
  }, [safeAddress, dispatch, showTxConfirmedToast]);

  return socketRef;
}
