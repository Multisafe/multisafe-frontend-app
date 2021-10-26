import React, {ReactNode, useEffect, useState} from 'react';
import Button from 'components/common/Button';
import { Modal, ModalHeader, ModalBody } from "components/common/Modal";
import styled from 'styled-components/macro';
import {Label} from './types';
import Input from 'components/common/Form/Input';
import {useDispatch, useSelector} from 'react-redux';
import {makeSelectOwnerSafeAddress} from 'store/global/selectors';
import {useActiveWeb3React} from 'hooks';
import {createOrUpdateLabel} from 'store/multisig/actions';
import ErrorText from '../../common/ErrorText';

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

type Props = {
  anchor?: ReactNode;
  label?: Label;
};

export const AddEditLabel = ({label, anchor}: Props) => {
  const [shown, setShown] = useState(false);

  const [name, setName] = useState(label?.name || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const safeAddress = useSelector(makeSelectOwnerSafeAddress());
  const { account: userAddress, chainId: networkId } = useActiveWeb3React();

  const toggleModal = () => {
    if (shown) {
      setShown(false);
    } else {
      setShown(true);
    }
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
    toggleModal();
  };

  const onSubmit = () => {
    setError("");
    setLoading(true);

    const newLabel = {
      ...(label ? label : {}),
      name,
      description: ""
    }
    dispatch(createOrUpdateLabel(networkId, safeAddress, userAddress, newLabel, !label, onError, onSuccess))
  };

  const onChange = (e: FixMe) => {
    const value = e?.target?.value;

    setName(value);
  }

  return (
    <React.Fragment>
      <div onClick={toggleModal}>
        {anchor ? anchor : (
          <Button>Add Label</Button>
        )}
      </div>
      <Modal isOpen={shown} toggle={toggleModal}>
        <ModalHeader title={!label ? "Add Label" : "Edit Label"} toggle={toggleModal} />
        <ModalBody width="55rem" minHeight="auto">
          <Container>
            <LabelContainer>
              <Title>Label Name</Title>
              <Input {...{
                type: "text",
                name: "name",
                id: "name",
                placeholder: "Label Name",
                required: true,
                onChange,
                value: name
              }}/>
              {error ? (
                <ErrorText>{error}</ErrorText>
              ) : null}
            </LabelContainer>
            <ButtonContainer>
              <Button
                onClick={onSubmit}
                style={{ minWidth: "16rem" }}
                disabled={loading || !name || name === label?.name}
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
}
