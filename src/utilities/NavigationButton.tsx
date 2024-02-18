import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  navType: string;
  img: string;
  onNavClick: (page: string) => void;
}

const NavigationButton = ({ img, children, navType, onNavClick }: Props) => {
  return (
    <button
      typeof="button"
      className="btn btn-tertiary d-flex w-100 p-3 mb-3"
      onClick={() => onNavClick(navType)}
    >
      <img src={img} className="pe-2" alt="" />
      <div className="text-white">{children}</div>
    </button>
  );
};

export default NavigationButton;
