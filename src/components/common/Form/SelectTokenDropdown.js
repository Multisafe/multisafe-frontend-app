import React, { useState } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { defaultTokenOptions } from "utils/massPayout";

const inputStyles = {
  control: (styles) => ({
    ...styles,
    width: "100%",
    minHeight: "52px",
    borderRadius: "8px",
    backgroundColor: "#f2f2f2",
    fontSize: "16px",
    fontWeight: "500",
    fontStretch: "normal",
    fontStyle: "normal",
    lineHeight: "1.19",
    letterSpacing: "normal",
    textAlign: "left",
    color: "#373737",
    border: "solid 0.5px #aaaaaa",
  }),
  option: (styles) => {
    return {
      ...styles,
    };
  },
  input: (styles) => ({ ...styles }),
  placeholder: (styles) => ({ ...styles }),
  singleValue: (styles, { data }) => ({ ...styles }),
};

const SelectTokenDropdownField = ({
  name,
  options = defaultTokenOptions,
  ...rest
}) => {
  const [selectedOption, setSelectedOption] = useState(options[0]);

  return (
    <div>
      <Select
        name={name}
        defaultValue={selectedOption}
        onChange={setSelectedOption}
        options={options}
        styles={inputStyles}
        {...rest}
      />
    </div>
  );
};

SelectTokenDropdownField.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.element,
      ]),
    })
  ),
};

export default SelectTokenDropdownField;
