import React from "react";
import { ToastContainer, toast, cssTransition } from "react-toastify";
import styled from "styled-components/macro";

import "react-toastify/dist/ReactToastify.min.css";
import "animate.css/animate.min.css";

const bounce = cssTransition({
  enter: "animate__animated animate__fadeInDown animate__faster",
  exit: "animate__animated animate__fadeOutUp animate__faster",
});

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

  &.Toastify__toast-container--top-center {
    width: 47rem;
    top: 2rem;
  }

  &.Toastify__toast-container.Toastify__toast-container--top-center {
    display: block;
  }

  .Toastify__toast--error {
  }
  .Toastify__toast.Toastify__toast--warning {
    width: 100%;
    background: rgba(252, 76, 60, 0.1);
    border-radius: 0.4rem;
    overflow: visible;
  }
  .Toastify__toast--success {
  }

  .Toastify__toast--warning .Toastify__toast-body {
    font-family: "Avenir Pro", sans-serif;
    font-size: 1.4rem;
    color: #fc4c3c;
  }

  .Toastify__close-button--warning {
    position: absolute;
    top: -1rem;
    right: -1rem;
    background-color: #989898;
    border-radius: 50%;
    width: 2rem;
    height: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
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
    color: #1452f5;
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
    color: #1452f5;
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
export function showWarningToast(msg, ...rest) {
  toast.warn(msg, {
    position: "top-center",
    autoClose: false,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    transition: bounce,
    ...rest,
  });
}

export const toaster = toast;
