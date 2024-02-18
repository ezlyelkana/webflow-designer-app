import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const Container = ({ children }: Props) => {
  return (
    <div className="container h-100 py-4 d-flex flex-column">{children}</div>
  );
};

export default Container;
