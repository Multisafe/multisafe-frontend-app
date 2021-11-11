import { ReactNode, useContext, createContext, useState } from "react";

import Img from "components/common/Img";
import ArrowDownIcon from "assets/icons/new-transfer/arrow-down-icon.svg";
import ArrowUpIcon from "assets/icons/new-transfer/arrow-down-icon.svg";
import { Container, Header, Body, Item } from "./styles";

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

export function AccordionItem({ children, ...rest }: Props) {
  const [toggle, setToggle] = useState<boolean>(false);

  return (
    <ToggleContext.Provider value={{ toggle, setToggle }}>
      <Item {...rest}>{children}</Item>
    </ToggleContext.Provider>
  );
}

export function AccordionHeader({ children, ...rest }: Props) {
  const { toggle, setToggle } = useContext(ToggleContext) as IToggleContext;

  return (
    <Header onClick={() => setToggle(!toggle)} toggle={toggle} {...rest}>
      {children}
      {toggle ? (
        <Img src={ArrowDownIcon} alt="arrow down" />
      ) : (
        <Img src={ArrowUpIcon} alt="arrow up" />
      )}
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

// export function AccordionTitle({ children, ...rest }: Props) {
//   return <Title {...rest}>{children}</Title>;
// }

// export function AccordionFrame({ children, ...rest }: Props) {
//   return <Frame {...rest}>{children}</Frame>;
// }
