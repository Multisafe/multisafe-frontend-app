import React, { useEffect } from "react";
import Select from "react-select";
import { inputStyles } from "components/common/Form";
import { useDispatch, useSelector } from "react-redux";
import { selectLabels } from "store/multisig/selectors";
import { Label } from "store/multisig/types";
import { useInjectReducer } from "utils/injectReducer";
import { MULTISIG_KEY } from "store/multisig/constants";
import multisigReducer from "store/multisig/reducer";
import { useInjectSaga } from "utils/injectSaga";
import multisigSaga from "store/multisig/saga";
import { useActiveWeb3React } from "hooks";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import { getLabels } from "store/multisig/actions";

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
  name: string;
  value: FixMe;
  onChange: FixMe;
  onBlur: FixMe;
  disabled?: boolean;
};

export const transformLabels = (labels: Label[]) =>
  labels?.length
    ? labels.map(({ labelId, name, colorCode }: Label) => ({
        value: labelId,
        label: name,
        color: colorCode,
      }))
    : [];

export const LabelsSelect = ({
  onChange,
  onBlur,
  disabled,
  name,
  value,
}: Props) => {
  const dispatch = useDispatch();

  const allLabels = useSelector(selectLabels);

  const { account: userAddress, chainId: networkId } = useActiveWeb3React();
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());

  useEffect(() => {
    if (!allLabels) {
      dispatch(getLabels(networkId, ownerSafeAddress, userAddress));
    }
  }, [dispatch, networkId, ownerSafeAddress, userAddress, allLabels]);

  useInjectReducer({ key: MULTISIG_KEY, reducer: multisigReducer });
  //@ts-ignore
  useInjectSaga({ key: MULTISIG_KEY, saga: multisigSaga });

  const options = transformLabels(allLabels || []);

  return (
    <Select
      {...{
        styles: { ...inputStyles, ...labelSelectStyles },
        name,
        isMulti: true,
        isClearable: false,
        required: true,
        width: "100%",
        placeholder: "Add Labels",
        options,
        value,
        onChange,
        onBlur,
        disabled,
        closeMenuOnSelect: false,
      }}
    />
  );
};
