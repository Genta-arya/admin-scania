import React, { useState } from "react";
import { FaFolder, FaPlus } from "react-icons/fa"; // Mengimpor ikon folder dari react-icons
import Button from "../../../components/Button";

const FolderList = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);

  const folders = [
    { id: 1, name: "Workshop A" },
    { id: 2, name: "Pictures" },
    { id: 3, name: "Music" },
    { id: 4, name: "Videos" },
    { id: 5, name: "Documents" },
  ];

  const handleRightClick = (e, folder) => {
    e.preventDefault(); // Mencegah menu klik kanan bawaan browser
    setSelectedFolder(folder);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFolder(null);
  };

  const handleDeleteFolder = () => {
    alert(`Deleting folder: ${selectedFolder.name}`);
    // Lakukan aksi penghapusan di sini
    setShowModal(false);
  };

  return (
    <div className="w-screen md:px-4">
      <div className="mb-4 md:flex lg:flex gap-4 justify-between flex-grow px-2 lg:px-8 md:px-4">
        <div className="gap-2 flex w-full">
          <Button
            text="Add New Folder"
            width="md:w-auto lg:w-auto w-full"
            icon={<FaPlus />}
          />
        </div>
      </div>

      {/* Folder Grid */}
      <div className="px-0">
        <ul className="gap-2 grid md:grid-cols-8 lg:grid-cols-10 grid-cols-4 mt-8">
          {folders.map((folder) => (
            <li
              key={folder.id}
              className=""
              onContextMenu={(e) => handleRightClick(e, folder)}
              onDoubleClick={(e) => handleRightClick(e, folder)}
            >
              <div className="flex flex-col items-center hover:cursor-pointer">
                <FaFolder className="text-gray-600 text-6xl" /> {/* Ikon folder */}
                <span className="text-xs max-w-20 text-center">{folder.name}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal untuk konfirmasi hapus */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              Delete Folder "{selectedFolder?.name}"?
            </h2>
            <p className="mb-4">This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                onClick={handleDeleteFolder}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FolderList;
