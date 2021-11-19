import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isEqual } from "lodash";
import { TxDetails } from "store/multisig/types";
import {
  updateTransactionLabels,
  createTransactionLabels,
} from "store/multisig/actions";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import { useActiveWeb3React } from "hooks";
import ErrorText from "components/common/ErrorText";

import { LabelsSelect, transformLabels } from "components/LabelsSelect";

type Props = {
  txDetails: TxDetails;
};

export const UpdateLabels = ({ txDetails }: Props) => {
  const { transactionId, transactionHash, labels, origin } = txDetails;

  const dispatch = useDispatch();

  const safeAddress = useSelector(makeSelectOwnerSafeAddress());
  const { account: userAddress } = useActiveWeb3React();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedLabels, setSelectedLabels] = useState(transformLabels(labels));

  const onChange = (value: FixMe) => {
    setSelectedLabels(value || []);
  };

  const onError = () => {
    setLoading(false);
    setError("Couldn't update labels");
  };

  const onSuccess = () => {
    setLoading(false);
  };

  const onBlur = () => {
    const selectedLabelIds = selectedLabels.map(({ value }) => value);
    const initialLabelIds = labels.map(({ labelId }) => labelId);

    if (!isEqual(selectedLabelIds, initialLabelIds)) {
      setError("");
      setLoading(true);

      if (transactionId) {
        dispatch(
          updateTransactionLabels({
            transactionId,
            userAddress,
            labels: selectedLabelIds,
            onError,
            onSuccess,
          })
        );
      } else {
        dispatch(
          createTransactionLabels({
            transactionHash,
            safeAddress,
            userAddress,
            origin,
            labels: selectedLabelIds,
            onError,
            onSuccess,
          })
        );
      }
    }
  };

  return (
    <div>
      <LabelsSelect
        {...{
          name: "labels",
          value: selectedLabels,
          onChange,
          onBlur,
          disabled: loading,
        }}
      />
      {error ? <ErrorText>{error}</ErrorText> : null}
    </div>
  );
};
