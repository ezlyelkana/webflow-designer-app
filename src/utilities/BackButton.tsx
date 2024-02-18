interface Props {
  navType: string;
  onBtnClick: (page: string) => void;
}

const BackButton = ({ navType, onBtnClick }: Props) => {
  return (
    <a className="btn-link" onClick={() => onBtnClick(navType)}>
      <img src="/ChevronSmallLeft.svg" alt="back" width="25" />
      Back
    </a>
  );
};

export default BackButton;
