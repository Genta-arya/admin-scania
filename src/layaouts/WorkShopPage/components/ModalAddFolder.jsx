import React, { useState } from "react";
import Modal from "../../../components/Modal";
import { toast } from "sonner";
import handleError from "../../../utils/HandleError";
import { createFolder } from "../../../service/API/Folder/_serviceFolder";

const ModalAddFolder = ({ isOpen, onClose , refresh }) => {
  const [folderName, setFolderName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (folderName.trim()) {
      try {
     await createFolder({ name: folderName });
        setFolderName("");
        onClose();
        refresh();
        toast.success("Folder added successfully");
      } catch (error) {
        handleError(error);
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Add New Folder</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Folder Name
            </label>
            <input
              type="text"
              value={folderName}
              required
              onChange={(e) => setFolderName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter folder name"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500  text-white font-bold py-2 px-4 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-gray-800  text-white font-bold py-2 px-4 rounded"
            >
              Add Folder
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ModalAddFolder;
