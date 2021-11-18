import { ReactNode } from "react";

export type ModalProps = {
  toggle: () => void;
  children?: ReactNode;
  isOpen?: boolean;
};

export type ModalBodyProps = {
  children?: ReactNode;
  width?: number | string;
  minHeight?: number | string;
};
