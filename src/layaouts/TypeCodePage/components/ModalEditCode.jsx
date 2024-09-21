import React, { useState } from "react";
import Modal from "../../../components/Modal";
import { FaEye } from "react-icons/fa";
import { toast, Toaster } from "sonner";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import app from "../../../service/FirebaseConfig";
import { updatedCode } from "../../../service/API/typeCode/_serviceType";
import LoadingButton from "../../../components/LoadingButton";
const ModalEditCode = ({ isModalOpen, closeModal, refresh, data }) => {
  const dataCode = data;

  const [code, setCode] = useState(dataCode.code || "");
  const [pdfUrl, setPdfUrl] = useState(dataCode.pdfUrl || "");
  const [currentPdf, setCurrentPdf] = useState(dataCode.pdfUrl || "");
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isChangingPdf, setIsChangingPdf] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(pdfUrl);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let newPdfUrl = currentPdf;

      if (selectedFile) {
        const storage = getStorage(app);
        const fileName = `${selectedFile.name}_${code}.pdf`;
        const storageRef = ref(storage, `pdfs/${fileName}`);

        const uploadTask = uploadBytesResumable(storageRef, selectedFile);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            null,
            (error) => reject(error),
            async () => {
              newPdfUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });

        if (pdfUrl) {
          const decodedPdfUrl = decodeURIComponent(currentPdf);
          const fileNameWithQuery = decodedPdfUrl.split("/").pop();
          const oldFileName = fileNameWithQuery.split("?")[0]; //

          const oldPdfRef = ref(storage, `pdfs/${oldFileName}`);
          await deleteObject(oldPdfRef);
        }
      }

      const dataToSubmit = {
        code,
        pdfUrl: newPdfUrl,
      };

      await updatedCode(dataCode.id, dataToSubmit);

      toast.success("Code updated successfully!");
      refresh();
      closeModal();
    } catch (error) {
      toast.error("Failed to update code!");
    } finally {
      setLoading(false);
    }
  };

  const openPdfModal = () => {
    setIsPdfModalOpen(true);
  };

  const closePdfModal = () => {
    setIsPdfModalOpen(false);
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setPdfUrl(fileUrl);
      setPreviewUrl(fileUrl);
    }
  };

  const copyUrlToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(pdfUrl);
      toast.success("URL copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy URL!");
    }
  };
  return (
    <>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2 className="text-lg font-bold mb-4">Edit Code</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="code" className="block text-sm font-medium">
              Code
            </label>
            <input
              type="text"
              id="code"
              className="mt-1 block w-full px-3 py-2 border rounded-md"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="pdfUrl" className="block text-sm font-medium">
              PDF URL
            </label>
            <div className="flex gap-2 text-xs">
              <input
                type="text"
                id="pdfUrl"
                onClick={copyUrlToClipboard}
                className="mt-1 block w-full px-3 py-2 border cursor-pointer hover:border-green-500 rounded-md bg-gray-100"
                value={pdfUrl}
                readOnly
              />
              <button
                type="button"
                className="bg-gray-800 rounded-md text-white px-2"
                onClick={openPdfModal}
              >
                <div className="flex items-center gap-2">
                  <FaEye />
                  <p>Preview</p>
                </div>
              </button>
            </div>
            {!isChangingPdf ? (
              <button
                type="button"
                onClick={() => setIsChangingPdf(true)}
                className="mt-2 px-4 py-2  text-center w-full bg-orange-500 font-bold text-white rounded-md"
              >
                Change PDF
              </button>
            ) : (
              <div className="mt-2">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col-reverse gap-2">
            {!loading && (
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 bg-gray-500 hover:opacity-80 text-white rounded-md"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-gray-800 hover:opacity-80 text-white rounded-md"
            >
              <LoadingButton loading={loading} text={"Save"} />
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isPdfModalOpen} onClose={closePdfModal}>
        <h2 className="text-lg font-bold mb-4">Preview PDF</h2>
        <div className="w-full h-96">
          <iframe
            src={previewUrl}
            title="PDF Preview"
            className="w-full h-full border"
          />
        </div>
      </Modal>
    </>
  );
};

export default ModalEditCode;
