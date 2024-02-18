import React from "react";

interface Props {
  singleObjectButtonClick: () => void;
  refObjectButtonClick: () => void;
  deleteConnectionButtonClick: () => void;
  inputValue: string;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormConnector: React.FC<Props> = ({ singleObjectButtonClick, refObjectButtonClick, inputValue,onInputChange,deleteConnectionButtonClick}) => {
  const handleButtonClick1 = () => {
    singleObjectButtonClick();
  };

  const handleButtonClick2 = () => {
    refObjectButtonClick();
  };

  const handleDeleteConnection = () => {
    deleteConnectionButtonClick();
  };

  return (
    <div className="container py-3">
      <p className="text-white mb-2 fw-semibold">Webflow form name</p>
      <div className="mb-2 bg-tertiary text-white rounded-2 px-2 py-1 shadow-sm">
        form name
      </div>
      <div className="d-flex flex-row mb-2">
        <p className="text-white pe-2">Form Type:</p>
        <p className="text-white">Static</p>
      </div>

      <hr className="text-white my-0" />
        <div className="mb-3">
          <input type="text" className="form-control bg-dark text-white" id="exampleInputEmail1" value={inputValue} onChange={onInputChange} aria-describedby="emailHelp" />
          <div id="emailHelp" className="form-text">Example of predetermined value</div>
        </div>
      <button className="btn btn-primary mt-2" onClick={handleButtonClick1}>
        Enter object (Lead)
      </button>

      <button className="btn btn-primary mt-2 ms-2" onClick={handleButtonClick2}>
        Enter object with reference (Account)
      </button>
      <br />
      <button className="btn btn-danger mt-2" onClick={handleDeleteConnection}>
        Delete Form Connection
      </button>
    </div>
  );
};

export default FormConnector;
