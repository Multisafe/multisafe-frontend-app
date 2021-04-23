import React from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { Controller } from "react-hook-form";
import { defaultTokenOptions } from "utils/tokens";

const inputStyles = {
  control: (styles, state) => ({
    ...styles,
    width: state.selectProps.width || "100%",
    minHeight: "4rem",
    borderRadius: "0.5rem",
    backgroundColor: "#ffffff",
    fontSize: "1.4rem",
    color: "#373737",
    border: `solid 0.1rem ${state.isFocused ? "#7367f0" : "#dddcdc"}`,
    "&:hover": {
      borderColor: "#7367f0",
    },
    boxShadow: "none",
  }),
  option: (styles, state) => {
    return {
      ...styles,
      width: state.selectProps.width || "100%",
      fontSize: "1.4rem",
    };
  },
  menu: (styles, state) => {
    return {
      ...styles,
      width: state.selectProps.width || "100%",
      fontSize: "1.4rem",
    };
  },
  indicatorSeparator: (styles) => {
    return {
      display: "none",
      ...styles,
    };
  },
  input: (styles) => ({ ...styles }),
  placeholder: (styles) => ({ ...styles }),
  singleValue: (styles, { data }) => ({ ...styles }),
};
const SelectField = ({
  name,
  register,
  required,
  options = defaultTokenOptions,
  isDisabled,
  isLoading,
  isClearable,
  isSearchable,
  width,
  control,
  ...rest
}) => (
  <Controller
    name={name}
    control={control}
    as={Select}
    className="basic-single"
    classNamePrefix="select"
    defaultValue={options[0] || `Select`}
    isDisabled={isDisabled}
    isLoading={isLoading}
    isClearable={isClearable}
    isSearchable={isSearchable}
    options={options}
    styles={inputStyles}
    width={width}
    {...rest}
  />
);

SelectField.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
};

export default SelectField;
