import React from "react";
import PropTypes from "prop-types";
import Select, { createFilter } from "react-select";
import { Controller } from "react-hook-form";
import { FixedSizeList as List } from "react-window";

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
      width: "100%",
      overflow: "hidden",
      fontSize: "1.4rem",
      backgroundColor: state.isFocused ? "#f1f0fd" : "#ffffff",
      color: "#373737",
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
  singleValue: (styles) => ({ ...styles }),
};

function MenuList(props) {
  const height = 40;
  const { children, maxHeight } = props;
  return (
    <List
      height={
        children.length
          ? children.length * height > maxHeight
            ? maxHeight
            : children.length * height
          : height
      }
      itemCount={children.length || 1}
      itemSize={height}
      initialScrollOffset={0}
    >
      {({ index, style }) =>
        children.length ? (
          <div style={style}>{children[index]}</div>
        ) : (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{
              ...style,
              color: "#8b8b8b",
              fontSize: "1.2rem",
            }}
          >
            No tokens found
          </div>
        )
      }
    </List>
  );
}

const TokenSelectField = ({
  name,
  control,
  required,
  options,
  isDisabled,
  isLoading,
  isClearable,
  isSearchable,
  width,
  placeholder,
  ...rest
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required }}
      render={({ onChange, value }) => (
        <Select
          name={name}
          className="basic-single"
          classNamePrefix="select"
          isDisabled={isDisabled}
          isLoading={isLoading}
          isClearable={isClearable}
          isSearchable={isSearchable}
          options={options}
          styles={inputStyles}
          width={width}
          filterOption={createFilter({ ignoreAccents: false })}
          components={{ MenuList }}
          onChange={onChange}
          value={value}
          placeholder={placeholder}
          {...rest}
        />
      )}
    />
  );
};

TokenSelectField.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
};

export default TokenSelectField;
