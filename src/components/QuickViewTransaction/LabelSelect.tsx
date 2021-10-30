import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { isEqual } from "lodash";
import { Label, TxDetails } from "store/multisig/types";
import { selectLabels } from "store/multisig/selectors";
import { inputStyles } from "components/common/Form";
import {
  updateTransactionLabels,
  createTransactionLabels,
} from "store/multisig/actions";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import { useActiveWeb3React } from "hooks";
import ErrorText from "components/common/ErrorText";

const labelSelectStyles = {
  multiValueLabel: (styles: FixMe, { data }: FixMe) => ({
    ...styles,
    fontSize: "1.4rem",
    backgroundColor: data.color,
  }),
  multiValueRemove: (styles: FixMe, { data }: FixMe) => ({
    ...styles,
    fontSize: "1.4rem",
    backgroundColor: data.color,
    ":hover": {
      backgroundColor: data.color,
      opacity: 0.6,
    },
  }),
};

type Props = {
  txDetails: TxDetails;
};

const transformLabels = (labels: Label[]) =>
  labels?.length
    ? labels.map(({ labelId, name, colorCode }: Label) => ({
        value: labelId,
        label: name,
        color: colorCode,
      }))
    : [];

export const LabelSelect = ({ txDetails }: Props) => {
  const { transactionId, transactionHash, labels, origin } = txDetails;

  const dispatch = useDispatch();
  const allLabels = useSelector(selectLabels);

  const safeAddress = useSelector(makeSelectOwnerSafeAddress());
  const { account: userAddress } = useActiveWeb3React();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedLabels, setSelectedLabels] = useState(transformLabels(labels));

  const options = transformLabels(allLabels);

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
      <Select
        {...{
          styles: { ...inputStyles, ...labelSelectStyles },
          name: "labels",
          isMulti: true,
          isClearable: false,
          required: true,
          width: "100%",
          placeholder: "Add Labels",
          options,
          value: selectedLabels,
          onChange,
          onBlur,
          disabled: loading,
          closeMenuOnSelect: false
        }}
      />
      {error ? <ErrorText>{error}</ErrorText> : null}
    </div>
  );
};
