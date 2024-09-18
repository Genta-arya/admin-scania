import React, { useState } from "react";
import Modal from "../../../components/Modal";
import { handlePostType } from "../../../service/API/typeCode/_serviceType";
import { toast } from "sonner";
import handleError from "../../../utils/HandleError";
import LoadingButton from "../../../components/LoadingButton";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import app from "../../../service/FirebaseConfig";

const ModalAddCode = ({ isModalOpen, closeModal, refresh }) => {
  const [form, setForm] = useState({
    type: "",
    codes: [{ code: "", pdf: null, pdfUrl: "" }],
  });
  const [loading, setLoading] = useState(false);

  const handleAddCode = () => {
    setForm({
      ...form,
      codes: [...form.codes, { code: "", pdf: null, pdfUrl: "" }],
    });
  };

  const handleRemoveCode = (index) => {
    setForm({
      ...form,
      codes: form.codes.filter((_, i) => i !== index),
    });
  };

  const handleChange = (index, field, value) => {
    const updatedCodes = form.codes.map((code, i) =>
      i === index ? { ...code, [field]: value } : code
    );
    setForm({ ...form, codes: updatedCodes });
  };

  const handleTypeChange = (e) => {
    setForm({ ...form, type: e.target.value });
  };

  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      const updatedCodes = form.codes.map((code, i) =>
        i === index ? { ...code, pdf: file } : code
      );
      setForm({ ...form, codes: updatedCodes });
    } else {
      alert("Please upload a valid PDF file.");
    }
  };
  const deletePdfFromFirebase = async (pdfUrl) => {
    const storage = getStorage(app);
    const storageRef = ref(storage, pdfUrl);

    return deleteObject(storageRef);
  };
  const uploadPdfToFirebase = async (file, code) => {
    const storage = getStorage(app);
    const fileName = `${code}_${file.name}`; 
    const storageRef = ref(storage, `pdfs/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        null,
        (error) => reject(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const uploadedPdfUrls = []; 
    try {
     
      const updatedCodes = await Promise.all(
        form.codes.map(async (code) => {
          if (code.pdf) {
            const pdfUrl = await uploadPdfToFirebase(
              code.pdf,
              code.code
            );
            uploadedPdfUrls.push(pdfUrl); 
            return { ...code, pdfUrl };
          }
          return code;
        })
      );

      const dataToSubmit = {
        name: form.type,
        codes: updatedCodes.map(({ code, pdfUrl }) => ({
          code,
          pdfUrl, 
        })),
      };

      const response = await handlePostType(dataToSubmit);
      if (response.message) {
        toast.success(response.message);
        refresh();
        closeModal();
      }
    } catch (error) {
      // Jika terjadi error, hapus semua file yang sudah di-upload
      await Promise.all(
        uploadedPdfUrls.map(async (pdfUrl) => {
          try {
            await deletePdfFromFirebase(pdfUrl);
          } catch (deleteError) {
            console.error("Error deleting PDF:", deleteError);
          }
        })
      );

      handleError(error);
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isModalOpen} onClose={closeModal}>
      <h2 className="text-lg font-bold mb-4">Add New Type</h2>
      <div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="h-[400px] overflow-auto">
            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700"
              >
                Type
              </label>
              <input
                id="type"
                type="text"
                value={form.type}
                required
                onChange={handleTypeChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
                placeholder="Enter type"
              />
            </div>
            {form.codes.map((codeItem, index) => (
              <div key={index} className="border p-4 rounded bg-gray-50 mt-4">
                <div className="mb-4">
                  <label
                    htmlFor={`code-${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Code #{index + 1}
                  </label>
                  <input
                    id={`code-${index}`}
                    type="text"
                    value={codeItem.code}
                    required
                    onChange={(e) =>
                      handleChange(index, "code", e.target.value)
                    }
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                    placeholder="Enter code"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor={`pdf-${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    PDF Upload
                  </label>
                  <input
                    id={`pdf-${index}`}
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => handleFileChange(index, e)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                {form.codes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveCode(index)}
                    className="text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleAddCode}
            className="p-2 bg-green-500 w-full border-b text-white rounded hover:opacity-80"
          >
            Add Another Code
          </button>
          <div className="flex gap-2 mt-4 flex-col-reverse">
            <button
              type="button"
              onClick={closeModal}
              className="p-2 bg-gray-500 text-white rounded hover:opacity-80"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="p-2 bg-gray-800 hover:opacity-80 text-white rounded"
            >
              <LoadingButton text={"Save"} loading={loading} />
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ModalAddCode;
