import { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
};

export default function ExternalLink({ children, href }: Props) {
  return (
    <a href={href} rel="noopenner noreferrer" target="_blank">
      {children}
    </a>
  );
}
