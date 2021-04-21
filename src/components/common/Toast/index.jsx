import React from "react";
import { ToastContainer, toast } from "react-toastify";
import styled from "styled-components/macro";

import "react-toastify/dist/ReactToastify.min.css";

const StyledContainer = styled(ToastContainer).attrs({
  // custom props
})`
  &.Toastify__toast-container {
    position: absolute;
    width: 1200px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .Toastify__toast {
    width: 326px;
    min-height: 40px;
    padding: 12px;
    border-radius: 8px;
    background-color: rgba(255, 255, 255, 0.9);
  }

  &.Toastify__toast-container--top-right {
    top: 7em;
    right: 2em;
  }
  .Toastify__toast--error {
  }
  .Toastify__toast--warning {
  }
  .Toastify__toast--success {
  }
  .Toastify__toast-body {
    font-family: "Montserrat";
    font-size: 15px;
    font-weight: 300;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.19;
    -webkit-letter-spacing: normal;
    -moz-letter-spacing: normal;
    -ms-letter-spacing: normal;
    letter-spacing: normal;
    text-align: left;
    color: #373737;
  }
  .Toastify__progress-bar {
  }

  a {
    color: #7367f0;
    font-size: 14px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.19;
    -webkit-letter-spacing: normal;
    -moz-letter-spacing: normal;
    -ms-letter-spacing: normal;
    letter-spacing: normal;
    text-align: left;
    color: #7367f0;
    &:hover {
      color: #373737;
    }
  }
`;
export function ToastMessage() {
  return (
    <StyledContainer
      position="top-right"
      autoClose={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
    />
  );
}

export function showToast(msg, ...rest) {
  return toast(msg, {
    position: "top-right",
    autoClose: false,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    ...rest,
  });
}

export const toaster = toast;
