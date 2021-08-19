import React from "react";
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
    border: `solid 0.1rem ${state.isFocused ? "#1452f5" : "#dddcdc"}`,
    "&:hover": {
      borderColor: "#1452f5",
    },
    boxShadow: "none",
  }),
  option: (styles, state) => {
    return {
      ...styles,
      width: "100%",
      overflow: "hidden",
      fontSize: "1.4rem",
      backgroundColor: state.isFocused ? "#e7eefe" : "#ffffff",
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

const SelectTokenField = ({
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
  defaultValue,
  ...rest
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required }}
      defaultValue={defaultValue}
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

export default SelectTokenField;
