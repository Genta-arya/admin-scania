import React, { useState } from "react";
import { useCodeStore } from "../../../utils/useCodeTypeStore";
import Modal from "../../../components/Modal";
import Select from "react-select";
import Button from "../../../components/Button"; // Button komponen
import { FaPlus } from "react-icons/fa"; // Untuk icon pada button

const ModalAddNewCode = ({ isModalOpen, closeModal, refresh }) => {
  const { data } = useCodeStore(); // Mengambil data type dari Zustand store
  const [selectedType, setSelectedType] = useState(null); // State untuk tipe yang dipilih
  const [code, setCode] = useState(""); // State untuk input code
  const [pdfUrl, setPdfUrl] = useState(""); // State untuk input PDF URL

  // Konversi data type ke format yang bisa digunakan oleh react-select
  const options = data.map((type) => ({
    value: type.id,
    label: type.name,
  }));

  // Fungsi untuk submit data baru
  const handleSubmit = () => {
    if (!selectedType || !code || !pdfUrl) {
      alert("Please fill in all fields.");
      return;
    }

    const newCode = {
      typeId: selectedType.value,
      code,
      pdfUrl,
    };

    console.log("New Code Data:", newCode);

    
    refresh();
    closeModal(); 
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

          {/* Input untuk PDF URL */}
          <div className="mb-4">
            <label
              htmlFor="pdfUrl"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              PDF URL
            </label>
            <input
              id="pdfUrl"
              type="text"
              value={pdfUrl}
              onChange={(e) => setPdfUrl(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded w-full"
              placeholder="Enter PDF URL"
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
