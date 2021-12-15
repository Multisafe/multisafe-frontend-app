import React, { ReactNode, useEffect, useState } from "react";
import Button from "components/common/Button";
import { Modal, ModalHeader, ModalBody } from "components/common/Modal";
import styled from "styled-components/macro";
import { Label } from "store/multisig/types";
import Input from "components/common/Form/Input";
import { useDispatch, useSelector } from "react-redux";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import { useActiveWeb3React } from "hooks";
import { createOrUpdateLabel } from "store/multisig/actions";
import ErrorText from "components/common/ErrorText";
import { LabelColorPicker } from "./LabelColorPicker";
import { DEFAULT_LABEL_COLOR } from "./constants";
import PlusIcon from "assets/icons/dashboard/white-plus-icon.svg";
import Img from "components/common/Img";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5rem;
  padding: 3rem 6rem;
`;

const LabelContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Title = styled.div`
  font-size: 1.4rem;
  font-weight: 700;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const AddLabelButton = styled(Button)`
  display: flex;
  gap: 1rem;
`;

const ControlsContainer = styled.div`
  padding: 0 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: solid 0.1rem #dddcdc;
  border-radius: 0.2rem;
`;

const LabelInput = styled(Input)`
  border: none;

  &:focus {
    border: none;
  }
`;

type Props = {
  anchor?: ReactNode;
  label?: Label;
};

export const AddEditLabel = ({ label, anchor }: Props) => {
  const [shown, setShown] = useState(false);

  const [name, setName] = useState(label?.name || "");
  const [colorCode, setColorCode] = useState(
    label?.colorCode || DEFAULT_LABEL_COLOR
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const safeAddress = useSelector(makeSelectOwnerSafeAddress());
  const { account: userAddress, chainId: networkId } = useActiveWeb3React();

  const toggleModal = () => {
    if (shown) {
      setShown(false);
      reset();
    } else {
      setShown(true);
    }
  };

  const reset = () => {
    setName(label?.name || "");
    setColorCode(label?.colorCode || DEFAULT_LABEL_COLOR);
  };

  useEffect(() => {
    if (label?.name) {
      setName(label?.name);
    }
  }, [label?.name]);

  const onError = () => {
    setError(`Couldn't ${!label ? "create" : "update"} label`);
    setLoading(false);
  };

  const onSuccess = () => {
    setLoading(false);
    toggleModal();
  };

  const onSubmit = () => {
    setError("");
    setLoading(true);

    const newLabel = {
      ...(label ? label : {}),
      name,
      colorCode,
      description: "",
    };
    dispatch(
      createOrUpdateLabel(
        networkId,
        safeAddress,
        userAddress,
        newLabel,
        !label,
        onError,
        onSuccess
      )
    );
  };

  const onChange = (e: FixMe) => {
    const value = e?.target?.value;

    setName(value);
  };

  const canSubmit =
    name && (name !== label?.name || colorCode !== label?.colorCode);

  return (
    <React.Fragment>
      <div onClick={toggleModal}>
        {anchor ? (
          anchor
        ) : (
          <AddLabelButton>
            <Img src={PlusIcon} alt="plus" />
            <div>Add Label</div>
          </AddLabelButton>
        )}
      </div>
      <Modal isOpen={shown} toggle={toggleModal}>
        <ModalHeader
          title={!label ? "Add Label" : "Edit Label"}
          toggle={toggleModal}
        />
        <ModalBody width="55rem" minHeight="auto">
          <Container>
            <LabelContainer>
              <Title>Label Name</Title>
              <ControlsContainer>
                <LabelColorPicker
                  colorCode={colorCode}
                  onColorChange={setColorCode}
                />
                <LabelInput
                  {...{
                    type: "text",
                    name: "name",
                    id: "name",
                    placeholder: "Enter Label Name",
                    required: true,
                    onChange,
                    value: name,
                  }}
                />
              </ControlsContainer>
              {error ? <ErrorText>{error}</ErrorText> : null}
            </LabelContainer>
            <ButtonContainer>
              <Button
                onClick={onSubmit}
                style={{ minWidth: "16rem" }}
                disabled={loading || !canSubmit}
                loading={loading}
              >
                {!label ? "Create" : "Update"}
              </Button>
            </ButtonContainer>
          </Container>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};
