import React, { useCallback, useEffect, useRef } from "react";
import io from "socket.io-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";

import { ROOT_BE_URL } from "constants/endpoints";
import { showToast, toaster } from "components/common/Toast";
import { getMultisigTransactionByIdSuccess } from "store/multisig/actions";
import { getNotificationsSuccess } from "store/notifications/actions";
import { getTokensSuccess } from "store/tokens/actions";
import Button from "components/common/Button";
import { routeGenerators } from "constants/routes/generators";
import { useActiveWeb3React } from "hooks";

export default function useSocket(props) {
  const { safeAddress, isReadOnly } = props;

  const { chainId } = useActiveWeb3React();

  const socketRef = useRef();

  const dispatch = useDispatch();

  const showTxConfirmedToast = useCallback(
    (message) => {
      if (safeAddress) {
        toaster.dismiss();
        showToast(
          <div className="d-flex align-items-center">
            <div>
              <FontAwesomeIcon
                className="arrow"
                icon={faCheckCircle}
                color="#6cb44c"
                style={{ fontSize: "1.8rem" }}
              />
            </div>
            <div className="ml-3">
              <div>Transaction Confirmed</div>
              <Button
                iconOnly
                style={{ minHeight: "0" }}
                to={routeGenerators.dashboard.transactionById({
                  safeAddress,
                  transactionId: message.transaction.txDetails.transactionId,
                })}
                className="p-0 mt-2"
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
    [dispatch, safeAddress]
  );

  useEffect(() => {
    if (safeAddress && !isReadOnly) {
      socketRef.current = io.connect(ROOT_BE_URL);

      // txConfirmed
      socketRef.current.on(
        `${safeAddress}_${chainId}_txConfirmed`,
        (message) => {
          showTxConfirmedToast(message);
        }
      );

      // notifications
      socketRef.current.on(
        `${safeAddress}_${chainId}_notifications`,
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
                data.tokenBalances.log,
                chainId
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
  }, [safeAddress, dispatch, showTxConfirmedToast, isReadOnly, chainId]);

  return socketRef;
}
