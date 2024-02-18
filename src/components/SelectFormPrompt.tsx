const SelectFormPrompt = () => {
  return (
    <div className="container text-center d-flex align-items-center bg-primary py-5 rounded-2">
      <div className="col py-5">
        <img
          src="/NoClassStates.svg"
          alt="Salesforce logo"
          className=""
          width="25"
        />
        <p className="text-white mb-0">Select a form element from the design</p>
        <p className="text-secondary">Waiting for the form element...</p>
      </div>
    </div>
  );
};

export default SelectFormPrompt;
