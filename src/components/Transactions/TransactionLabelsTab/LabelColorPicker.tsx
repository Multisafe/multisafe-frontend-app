import React, { useState } from "react";
import { Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";
import styled from "styled-components";
import { COLORS, DEFAULT_COLOR } from "./constants";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const DropdownAnchor = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  cursor: pointer;
`;

const ColorContainer = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
`;

const SelectColor = styled(ColorContainer)`
  cursor: pointer;

  &:hover {
    border: 1px solid #1452f5;
  }
`;

const StyledMenu = styled(DropdownMenu)`
  padding: 0;
`;

const MenuContainer = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem;
`;

type Props = {
  colorCode: string;
  onColorChange: (color: string) => void;
};

export const LabelColorPicker = ({
  colorCode = DEFAULT_COLOR,
  onColorChange,
}: Props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const onSelectColor = (color: string) => {
    onColorChange(color);
    toggle();
  };

  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle
        tag="div"
        data-toggle="dropdown"
        aria-expanded={dropdownOpen}
      >
        <DropdownAnchor>
          <ColorContainer style={{ backgroundColor: colorCode }} />
          <FontAwesomeIcon icon={faAngleDown} />
        </DropdownAnchor>
      </DropdownToggle>
      <StyledMenu>
        <MenuContainer>
          {COLORS.map((color) => (
            <SelectColor
              key={color}
              style={{ backgroundColor: color }}
              onClick={() => onSelectColor(color)}
            />
          ))}
        </MenuContainer>
      </StyledMenu>
    </Dropdown>
  );
};
