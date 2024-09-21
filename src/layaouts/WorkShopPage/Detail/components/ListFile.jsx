import React, { useEffect, useState } from "react";
import handleError from "../../../../utils/HandleError";
import {
  getSingleFolder,
  uploadFile,
} from "../../../../service/API/Folder/_serviceFolder";
import Button from "../../../../components/Button";
import UploadPage from "./UploadPage";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "@firebase/storage";
import app from "../../../../service/FirebaseConfig";
import { FaFilePdf, FaPlus, FaTrash } from "react-icons/fa"; // Import ikon PDF
import Modal from "../../../../components/Modal";
import { toast } from "sonner";
import LoadingGlobal from "../../../../components/Loading";
import { FaPencil } from "react-icons/fa6";

const ListFile = ({ id }) => {
  const [data, setData] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [deleteFile, setDeleteFile] = useState(null); // File yang akan dihapus
  const [changeFile, setChangeFile] = useState(null); // File yang akan diubah
  const [nameFile, setNameFile] = useState(null);
  const fetchData = async () => {
    try {
      const response = await getSingleFolder(id);
      setData(response.data);
      setIsUploading(response.data.files.length === 0);
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const uploadFiles = async () => {
    try {
      const storage = getStorage(app);
      const uploadedFileLinks = await Promise.all(
        files.map(async (file) => {
          const fileRef = ref(storage, `pdfs/${file.name}`);
          await uploadBytes(fileRef, file);
          return await getDownloadURL(fileRef);
        })
      );

      await uploadFile(id, uploadedFileLinks);
      setFiles([]);
      fetchData();
      setIsUploading(false);
    } catch (error) {
      handleError(error);
      await Promise.all(
        files.map(async (file) => {
          const fileRef = ref(storage, `pdfs/${file.name}`);
          try {
            await deleteObject(fileRef);
          } catch (deleteError) {
            console.error("Failed to delete file:", file.name, deleteError);
          }
        })
      );
      setFiles([]);
    }
  };

  const handleClickFileToDelete = (file) => {
    setDeleteFile(file);
  };

  const handleDelete = async () => {
    try {
      const storage = getStorage(app);
      const fileRef = ref(storage, `pdfs/${deleteFile.name}`);
      await deleteObject(fileRef);
      toast.success("File deleted successfully");
      setDeleteFile(null);
      fetchData();
    } catch (error) {
      handleError(error);
    }
  };

  const handleClickFileToChange = (file, name) => {
    setChangeFile(file);
    setNameFile(name);
  };
  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const droppedFiles = Array.from(event.dataTransfer.files);
    const pdfFiles = droppedFiles.filter(
      (file) => file.type === "application/pdf"
    );

    if (pdfFiles.length + files.length > 20) {
      alert("Maximum 20 files can be uploaded.");
    } else {
      setFiles((prevFiles) => [...prevFiles, ...pdfFiles]);
    }
  };
  const handleClick = () => {
    document.getElementById("fileInput").click();
  };
  const handleFileChange = async (newFile) => {
    try {
      const storage = getStorage(app);
      const fileRef = ref(storage, `pdfs/${newFile.name}`);
      await uploadBytes(fileRef, newFile);
      const fileUrl = await getDownloadURL(fileRef);

      setChangeFile(null);
      fetchData();
      toast.success("File changed successfully");
    } catch (error) {
      handleError(error);
    }
  };
  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const pdfFiles = selectedFiles.filter(
      (file) => file.type === "application/pdf"
    );

    if (pdfFiles.length + files.length > 20) {
      alert("Maximum 20 files can be uploaded.");
    } else {
      setFiles((prevFiles) => [...prevFiles, ...pdfFiles]);
    }
  };
  const handleAddNewFile = () => {
    setFiles([]);
    setIsUploading(true);
  };
  const handleCancel = () => {
    setFiles([]);
    setIsUploading(false);
  };

  if (!data) return <LoadingGlobal />;

  return (
    <div className="px-6">
      {isUploading ? (
        <div className="flex flex-col items-center mx-auto justify-center min-h-screen">
          <UploadPage
            dragging={dragging}
            handleFileSelect={handleFileSelect}
            files={files}
            handleClick={handleClick}
            handleDragLeave={handleDragLeave}
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
          />

          <div className="mt-4 flex flex-col gap-2">
            {files.length > 0 && (
              <Button
                text={"Upload PDF"}
                width="w-full"
                onClick={uploadFiles}
              />
            )}
            <Button
              text={"Cancel"}
              width="w-full"
              bg="bg-red-500"
              onClick={handleCancel}
            />
          </div>
        </div>
      ) : (
        <>
          {data.files.length > 0 ? (
            <ul className="space-y-2">
              <div>
                <Button
                  text={"Add new file"}
                  width="w-full"
                  icon={<FaPlus />}
                  onClick={() => setIsUploading(true)}
                />
              </div>
              {data.files.map((file, index) => {
                const fileName = decodeURIComponent(
                  file.fileUrl.split("/o/").pop().split("?")[0]
                );

                const cleanFileName = fileName.split("pdfs/").pop();

                return (
                  <li
                    key={index}
                    className="flex items-center justify-between bg-blue-50 p-3 rounded-md shadow-sm transition"
                  >
                    <span className="flex items-center gap-2 text-gray-800 justify-between">
                      <button onClick={() => handleClickFileToDelete(file)}>
                        <FaTrash />
                      </button>
                      <div
                        className="flex items-center gap-1 hover:underline cursor-pointer"
                        onClick={() => setPreviewUrl(file.fileUrl)}
                      >
                        <FaFilePdf className="mr-2 text-red-500" />
                        <p>{cleanFileName}</p>
                      </div>
                    </span>
                    <button
                      className="flex"
                      onClick={() =>
                        handleClickFileToChange(file, cleanFileName)
                      }
                    >
                      <FaPencil />
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="mt-8">
              <Button
                text={"Add new file"}
                width="w-full"
                icon={<FaPlus />}
                onClick={() => setIsUploading(true)}
              />
              <div className="flex items-center justify-center mt-8">
                <p>No files found</p>
              </div>
            </div>
          )}
        </>
      )}

      {previewUrl && (
        <Modal onClose={() => setPreviewUrl(null)} isOpen={!!previewUrl}>
          <div className="mt-4">
            <iframe
              src={previewUrl}
              width="100%"
              height="600px"
              title="PDF Preview"
            />
          </div>
        </Modal>
      )}

      {/* Modal Delete */}
      {deleteFile && (
        <Modal onClose={() => setDeleteFile(null)} isOpen={!!deleteFile}>
          <div className="p-6">
            <h2 className="text-xl font-semibold">Confirm Delete</h2>
            <p>Are you sure you want to delete {deleteFile.name}?</p>
            <div className="mt-4 flex justify-end gap-2">
              <Button text="Cancel" onClick={() => setDeleteFile(null)} />
              <Button text="Delete" bg="bg-red-500" onClick={handleDelete} />
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Change File */}
      {changeFile && (
        <Modal onClose={() => setChangeFile(null)} isOpen={!!changeFile}>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Change File</h2>
            <input
              className="mb-4 border w-full px-3 py-1 rounded-sm"
              type="text"
              readOnly
              value={nameFile}
            ></input>
            <input
              type="file"
              accept="application/pdf"
              required
              onChange={(e) => handleFileSelect(e)}
            />

            <div className="mt-4 flex justify-end gap-2">
              <Button
                text="Cancel"
                onClick={() => setChangeFile(null)}
                bg="bg-red-500"
              />
              <Button
                text="Change"
                bg="bg-gray-800"
               
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ListFile;
