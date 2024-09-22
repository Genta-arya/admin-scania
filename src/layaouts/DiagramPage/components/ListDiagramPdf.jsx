import React, { useEffect, useState } from "react";
import Button from "../../../components/Button";
import { FaFilePdf } from "react-icons/fa";
import Modal from "../../../components/Modal";
import { useDropzone } from "react-dropzone";
import app from "../../../service/FirebaseConfig";
import {
  deleteWiring,
  getDataWiring,
  handleUploadWiring,
} from "./../../../service/API/Folder/_serviceFolder";
import handleError from "../../../utils/HandleError";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "@firebase/storage";
import LoadingGlobal from "../../../components/Loading";
import RenderData from "./RenderData";
import { toast } from "sonner";

const ListDiagramPdf = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [loadingACT, setLoadingACT] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getDataWiring();
      setData(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleDrop = (acceptedFiles) => {
    if (uploadedFiles.length + acceptedFiles.length <= 20) {
      setUploadedFiles((prev) => [...prev, ...acceptedFiles]);
    } else {
      toast.info("Maximum 20 files can be uploaded!");
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: {
      "application/pdf": [],
    },
  });

  const handleUploads = async () => {
    if (uploadedFiles.length === 0) {
      toast.info("Please select at least one file");
      return;
    }
    setLoadingACT(true);
    try {
      const promises = uploadedFiles.map(async (file) => {
        const storage = getStorage(app);
        const storageRef = ref(storage, `pdfs/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const pdfUrl = await getDownloadURL(storageRef);
        return { name: file.name, pdfUrl };
      });
      const results = await Promise.all(promises);
      await handleUploadWiring({
        name: results.map((result) => result.name),
        urls: results.map((result) => result.pdfUrl),
      });
      toast.success("Files uploaded successfully");
      fetchData();
      setUploadedFiles([]);
      setShowModal(false);
    } catch (error) {
      handleError(error);
    } finally {
      setLoadingACT(false);
    }
  };

  const handleRightClick = (e, file) => {
    e.preventDefault();
    setFileToDelete(file);
    setShowDeleteModal(true);
  };

  const handleDeleteFile = async () => {
    setData((prevData) =>
      prevData.filter((item) => item.id !== fileToDelete.id)
    );
    setLoadingACT(true);
    try {
      await deleteWiring(fileToDelete.id);
      setShowDeleteModal(false);
      setFileToDelete(null);
      toast.success("File deleted successfully");
      fetchData(); 

    } catch (error) {
      handleError(error);
    } finally {
      setLoadingACT(false);
    }
  };

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );
  if (loading) {
    return <LoadingGlobal />;
  }

  return (
    <div className="px-8">
      <div>
        <Button
          text={"Upload PDF"}
          icon={<FaFilePdf />}
          bg="bg-gray-800"
          width="w-full"
          onClick={() => setShowModal(true)}
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search File"
          className="w-full border border-gray-300 rounded-md p-2 mt-4"
        />
      </div>

      {filteredData.length > 0 ? (
        <RenderData
          data={filteredData}
          handleRightClick={handleRightClick}
          handleDeleteFile={handleDeleteFile}
        />
      ) : (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">File not found</p>
        </div>
      )}

      {showModal && (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <div className="p-6">
            <h2 className="text-xl mb-4">Upload PDF Files</h2>

            <div
              {...getRootProps()}
              className="border-dashed border-2 border-gray-300 p-6 text-center cursor-pointer"
            >
              <input {...getInputProps()} />
              <p>Drag & drop files here, or click to select files (PDF only)</p>
              <p className="text-sm text-gray-500">(Maximum 20 files)</p>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg mb-2">Files to be uploaded:</h3>
                <ul>
                  {uploadedFiles.map((file, index) => (
                    <li key={index} className="text-sm text-gray-700">
                      {file.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6">
              <Button
                text={"Upload Files"}
                bg="bg-gray-800"
                loading={loadingACT}
                width="w-full"
                onClick={() => {
                  handleUploads();
                }}
              />
            </div>
          </div>
        </Modal>
      )}

      {showDeleteModal && (
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
        >
          <div className="p-6">
            <h2 className="text-xl mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete "{fileToDelete?.name}"?</p>
            <div className="flex flex-col-reverse gap-2 mt-6">
              <Button
                text={"Cancel"}
                bg="bg-gray-500"
                width="w-auto"
                onClick={() => setShowDeleteModal(false)}
              />
              <Button
                text={"Delete"}
                bg="bg-red-600"
                loading={loadingACT}
                width="w-auto"
                onClick={handleDeleteFile}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ListDiagramPdf;
