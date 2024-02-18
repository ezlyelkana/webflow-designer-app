interface Props {
  onClickItem: (page: string) => void;
}

const SectionTitle = ({ onClickItem }: Props) => {
  return (
    <div className="container text-center h-100 d-flex align-items-center">
      <div className="col">
        <img
          src="/salesforce logo.png"
          alt="Salesforce logo"
          className="mb-4"
          width="150"
        />
        <p className="text-white mb-4">
          Add you active account to connect with Salesforce
        </p>
        <button className="btn btn-primary" onClick={() => onClickItem("Nav")}>
          Connect to your Salesforce Instance
        </button>
      </div>
    </div>
  );
};

export default SectionTitle;
