import React, { useState } from "react";
import { useCodeStore } from "../../../utils/useCodeTypeStore";
import Modal from "../../../components/Modal";
import Select from "react-select";
import Button from "../../../components/Button";
import { FaPlus } from "react-icons/fa";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

import { toast } from "sonner";
import app from "../../../service/FirebaseConfig";
import { addNewCode } from "../../../service/API/typeCode/_serviceType";
import handleError from "../../../utils/HandleError";

const ModalAddNewCode = ({ isModalOpen, closeModal, refresh }) => {
  const { data } = useCodeStore();
  const [selectedType, setSelectedType] = useState(null);
  const [code, setCode] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");

  const options = data.map((type) => ({
    value: type.id,
    label: type.name,
  }));

  // Fungsi untuk menangani upload file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPdfFile(file);
      const fileUrl = URL.createObjectURL(file);
      setPdfUrl(fileUrl);
    }
  };

  // Fungsi untuk submit data baru
  const handleSubmit = async () => {
    if (!selectedType || !code || !pdfFile) {
      toast.error("Please fill in all fields.");
      return;
    }

    const storage = getStorage(app);
    const fileName = `${pdfFile.name}_${code}.pdf`; // Format nama file
    const storageRef = ref(storage, `pdfs/${fileName}`);

    try {
      // Upload file PDF
      const uploadTask = uploadBytesResumable(storageRef, pdfFile);

      // Tunggu upload selesai dan dapatkan URL
      const newPdfUrl = await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          null,
          (error) => reject(error),
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(url);
          }
        );
      });

      // Data baru untuk dikirim ke server
      const newCode = {
        typeId: selectedType.value,
        code,
        pdfUrl: newPdfUrl,
      };

      // Kirim data ke server
      try {
        await addNewCode(newCode);
        toast.success("Code added successfully!");
        refresh();
        closeModal();
      } catch (serverError) {
        // Hapus file jika terjadi error saat pengiriman data
        try {
          await deleteObject(storageRef);
        } catch (deleteError) {
          console.error("Error deleting file:", deleteError);
        }
        handleError(serverError);
      }
    } catch (uploadError) {
      handleError(uploadError);
      // Menghapus file jika terjadi error saat upload
      try {
        await deleteObject(storageRef);
      } catch (deleteError) {
        console.error("Error deleting file:", deleteError);
      }
    }
  };

  return (
    <Modal isOpen={isModalOpen} onClose={closeModal}>
      <h2 className="text-lg font-bold mb-4">Add New Code</h2>

      {/* React Select untuk memilih Type */}
      <div className="mb-4">
        <label
          htmlFor="type"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Select Type
        </label>
        <Select
          id="type"
          options={options}
          value={selectedType}
          onChange={setSelectedType}
          placeholder="Choose a type..."
          className="text-sm"
          noOptionsMessage={() => "No types found"}
          isClearable
          isSearchable
        />
      </div>

      {selectedType && (
        <>
          <div className="mb-4">
            <label
              htmlFor="code"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Code
            </label>
            <input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded w-full"
              placeholder="Enter code"
            />
          </div>

          {/* Input untuk PDF file */}
          <div className="mb-4">
            <label
              htmlFor="pdfFile"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              PDF File
            </label>
            <input
              id="pdfFile"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {/* Tombol Submit */}
          <Button
            onClick={handleSubmit}
            text="Add Code"
            icon={<FaPlus />}
            width="w-full"
            bg="bg-gray-800"
          />
        </>
      )}
    </Modal>
  );
};

export default ModalAddNewCode;
