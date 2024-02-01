import React, { useState } from "react";
import Papa from "papaparse";
import APIService from "./APIService";
import ReactLoading from "react-loading";

function App() {
  const [file, setFile] = useState();
  const [newFileData, setNewFileData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
    setNewFileData([]);
  };

  const handleDataSubmitted = (e) => {
    e.preventDefault();
    // we shouldn't end up in this situation due to the button disabling, but just in case
    if (!file) return;
    setLoading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (res) {
        processData({ elements: res.data });
      },
    });
  };

  const processData = (csvFileData) => {
    APIService.ProcessData(csvFileData).then((response) => {
      setNewFileData(response.elements);
      setLoading(false);
    });
  };

  const handleDownload = (e) => {
    e.preventDefault();
    const formattedCsvFile = Papa.unparse(newFileData);
    const blob = new Blob([formattedCsvFile], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
    a.download = "Formatted CSV Data";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <>
      <div
        className={
          loading
            ? "blur-sm flex flex-col items-center"
            : "flex flex-col items-center"
        }
      >
        <h1 className="font-bold text-xl my-5 text-gray-600">
          Upload your CSV event data file
        </h1>

        <form className="flex flex-col items-center">
          <input
            type={"file"}
            id={"csvFileInput"}
            accept={".csv"}
            onChange={handleFileUpload}
            className="text-sm text-gray-600 my-3
            file:mr-5 file:py-3 file:px-10
            file:rounded-full file:border-0
            file:text-md file:font-semibold  file:text-white
            file:bg-gradient-to-r file:from-violet-500 file:to-emerald-500
            hover:file:cursor-pointer hover:file:opacity-80"
          />
          {file && (
            <button
              className="my-3
          py-3 px-10
          rounded-full border-0
          text-lg font-semibold  text-white
          bg-gray-600
          hover:cursor-pointer hover:opacity-80"
              onClick={handleDataSubmitted}
            >
              Process Data
            </button>
          )}
          {!!newFileData.length && !loading && (
            <button
              className="bg-gradient-to-l from-violet-500 to-emerald-500 text-white rounded-full border-0 my-3 py-3 px-10 text-lg font-semibold hover:cursor-pointer hover:opacity-80"
              onClick={handleDownload}
            >
              Download File
            </button>
          )}
        </form>
      </div>
      {loading && (
        <div className="flex flex-col items-center">
          <ReactLoading
            type="bars"
            color="#4B5563"
            height={110}
            width={100}
          ></ReactLoading>
          <p className="text-sm text-gray-400">This may take a minute...</p>
        </div>
      )}
    </>
  );
}

export default App;
