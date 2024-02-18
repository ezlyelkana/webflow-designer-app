import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}
const Footer = ({ children }: Props) => {
  return <div className="w-100 h-100 d-flex align-items-end">{children}</div>;
};

export default Footer;
