import { ReactNode, useContext, createContext, useState } from "react";

import ArrowDownIcon from "assets/icons/new-transfer/arrow-down-icon.svg";
import { Container, Header, Body, Item, ArrowImg } from "./styles";

type Props = {
  children: ReactNode;
};

type IToggleContext = {
  toggle: boolean;
  setToggle: (toggle: boolean) => void;
};

const ToggleContext = createContext<IToggleContext | undefined>(undefined);

export function Accordion({ children, ...rest }: Props) {
  return <Container {...rest}>{children}</Container>;
}

export function AccordionItem({
  children,
  isOpen,
  ...rest
}: Props & { isOpen: boolean }) {
  const [toggle, setToggle] = useState<boolean>(isOpen || false);

  return (
    <ToggleContext.Provider value={{ toggle, setToggle }}>
      <Item {...rest}>{children}</Item>
    </ToggleContext.Provider>
  );
}

export function AccordionHeader({ children, ...rest }: Props) {
  const { toggle, setToggle } = useContext(ToggleContext) as IToggleContext;

  return (
    <Header onClick={() => setToggle(!toggle)} {...rest}>
      {children}
      <ArrowImg src={ArrowDownIcon} alt="arrow down" toggle={toggle} />
    </Header>
  );
}

export function AccordionBody({ children, ...rest }: Props) {
  const { toggle } = useContext(ToggleContext) as IToggleContext;
  return (
    <Body toggle={toggle} {...rest}>
      {children}
    </Body>
  );
}
