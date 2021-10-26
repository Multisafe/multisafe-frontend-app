import React from 'react';
import styled from 'styled-components';
import {format} from 'date-fns';
import Img from 'components/common/Img';
import EditNoteIcon from "assets/icons/dashboard/edit-note-icon.svg";
import ArchiveIcon from "assets/icons/dashboard/archive-icon.svg";
import Button from 'components/common/Button';
import {Label} from './types';
import {AddEditLabel} from './AddEditLabel';

type Props = {
  label: Label;
};

const LabelContainer = styled.div`
  width: 320px;
  height: 60px;
  padding: 1rem;
  display: flex;
  gap: 1rem;
  border-radius: 5px;
  background-color: white;
`;

const DataContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  flex-grow: 1;
`;

const LabelName = styled.div`
  font-size: 1.6rem;
  font-weight: 700;
`;

const LabelDate = styled.div`
  font-size: 1.4rem;
`;

const ColorContainer = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 5px;
`;

const ControlsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const IconButton = styled(Button)`
  padding: 0.5rem;

  &:hover {
    opacity: 0.7;
  }
`;

const DEFAULT_COLOR_CODE = "#1452f5";

export const ManagedLabel = ({label}: Props) => {
  const {name, colorCode, createdOn} = label;

  const color = colorCode || DEFAULT_COLOR_CODE;

  return (
    <LabelContainer>
      <ColorContainer style={{backgroundColor: color}}/>
      <DataContainer>
        <LabelName>{name}</LabelName>
        <LabelDate>Created: {format(new Date(createdOn), "MMM-dd-yyyy")}</LabelDate>
      </DataContainer>
      <ControlsContainer>
        <AddEditLabel label={label} anchor={(
          <IconButton iconOnly>
            <Img
              src={EditNoteIcon}
              alt="edit"
              width="16"
            />
          </IconButton>
        )}/>
        <IconButton iconOnly>
          <Img
            src={ArchiveIcon}
            alt="archive"
            width="16"
          />
        </IconButton>
      </ControlsContainer>
    </LabelContainer>
  );
}
