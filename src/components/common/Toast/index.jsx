import React from "react";
import { ToastContainer, toast } from "react-toastify";
import styled from "styled-components/macro";

import "react-toastify/dist/ReactToastify.min.css";

const StyledContainer = styled(ToastContainer).attrs({
  // custom props
})`
  &.Toastify__toast-container {
    position: absolute;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .Toastify__toast {
    width: 33rem;
    min-height: 3rem;
    padding: 1.2rem;
    border-radius: 0.8rem;
    background-color: rgba(255, 255, 255, 0.9);
  }

  &.Toastify__toast-container--top-right {
    top: 7rem;
    right: 2rem;
  }
  .Toastify__toast--error {
  }
  .Toastify__toast--warning {
  }
  .Toastify__toast--success {
  }
  .Toastify__toast-body {
    font-family: "Avenir Pro", sans-serif;
    font-size: 1.6rem;
    font-weight: 300;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
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
    font-size: 1.4rem;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
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
