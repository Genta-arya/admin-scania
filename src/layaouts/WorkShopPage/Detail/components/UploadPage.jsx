import React from "react";

const UploadPage = ({
  handleFileSelect,
  files,
  dragging,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleClick,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center border-2 ${
        dragging
          ? "border-blue-400 bg-blue-50"
          : "border-dashed border-gray-400"
      } p-10 rounded-lg bg-gray-50 hover:bg-gray-100 transition w-full max-w-lg`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        id="fileInput"
        type="file"
        accept="application/pdf"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
      {files.length > 0 ? (
        <div className="text-gray-800 mb-4">
          <p>{files.length} file(s) uploaded:</p>
          <ul className="list-disc ml-5">
            {files.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      ) : (
        <>
          <p className="text-gray-500 mb-4">
            {dragging
              ? "Release to drop the files"
              : "Drag & drop your PDF files here or click to select"}
          </p>
        </>
      )}
    </div>
  );
};

export default UploadPage;
