import React, { useEffect, useState } from "react";
import { FaFolder, FaPlus } from "react-icons/fa"; // Mengimpor ikon folder dari react-icons
import Button from "../../../components/Button";
import { useNavigate } from "react-router-dom";
import ModalAddFolder from "./ModalAddFolder";
import handleError from "../../../utils/HandleError";
import {
  changeNameFodler,
  deleteFolder,
  handleGetFolder,
} from "../../../service/API/Folder/_serviceFolder";
import LoadingGlobal from "../../../components/Loading";
import LoadingButton from "../../../components/LoadingButton";

const FolderList = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [modalAdd, setModalAdd] = useState(false);
  const [folders, setFolder] = useState([]);
  const [editFolderId, setEditFolderId] = useState(null);
  const [editFolderName, setEditFolderName] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State untuk menampung input pencarian
  const navigate = useNavigate();

  const fetchdata = async () => {
    setLoading(true);
    try {
      const response = await handleGetFolder();
      setFolder(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRightClick = (e, folder) => {
    e.preventDefault();
    setSelectedFolder(folder);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFolder(null);
  };

  const handleDeleteFolder = async () => {
    setLoadingAction(true);
    try {
      await deleteFolder(selectedFolder.id);
      fetchdata();
      setShowModal(false);
    } catch (error) {
      handleError(error);
    } finally {
      setLoadingAction(false);
    }
  };

  const navigateDetail = (id, name) => {
    const formattedId = encodeURIComponent(id);
    const formattedName = name.replace(/\s+/g, "-");
    navigate(`/detail/${formattedName}/${formattedId}`);
  };

  const handleDoubleClick = (folder) => {
    setEditFolderId(folder.id);
    setEditFolderName(folder.name);
  };

  const handleEditFolderName = async (e) => {
    try {
      if (e.key === "Enter") {
        folders.map((folder) =>
          folder.id === editFolderId
            ? { ...folder, name: editFolderName }
            : folder
        );
        await changeNameFodler(editFolderId, editFolderName);
        fetchdata();
        setEditFolderId(null);
      }
    } catch (error) {
      handleError(error);
    }
  };

  // Fungsi untuk menangani pencarian folder
  const filteredFolders = folders.filter((folder) =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchdata();
  }, []);

  if (loading) return <LoadingGlobal />;

  return (
    <div className="w-screen md:px-4">
      <div className="mb-4 md:flex md:flex-row lg:flex-row flex-col lg:flex gap-4 justify-between   px-2 lg:px-8 md:px-4">
        <div className="gap-2 flex w-full">
          <Button
            onClick={() => setModalAdd(true)}
            text="Add New Folder"
            width="md:w-auto lg:w-auto w-full"
            icon={<FaPlus />}
          />
        </div>
        {/* Input untuk pencarian */}
        <input
          type="text"
          placeholder="Search folder..."
          className="border px-3 lg:mt-0 md:mt-0 mt-2 py-2 rounded-md w-full md:max-w-sm lg:max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="px-0">
        <ul className={`gap-2  md:grid-cols-8 lg:grid-cols-10 grid-cols-4 mt-8 ${filteredFolders.length === 0 ? "flex justify-center" : "grid"}`}>
          {/* Menampilkan folder yang sudah difilter */}
          {filteredFolders.length > 0 ? (
            filteredFolders.map((folder) => (
              <li key={folder.id}>
                <div className="flex flex-col items-center ">
                  <FaFolder
                    className="text-gray-600 text-6xl hover:cursor-pointer hover:opacity-70"
                    onContextMenu={(e) => handleRightClick(e, folder)}
                    onClick={() => navigateDetail(folder.id, folder.name)}
                  />
                  {editFolderId === folder.id ? (
                    <input
                      type="text"
                      value={editFolderName}
                      onChange={(e) => setEditFolderName(e.target.value)}
                      onKeyDown={handleEditFolderName}
                      className="text-xs max-w-20 text-center border-b border-gray-300 focus:outline-none"
                      autoFocus
                    />
                  ) : (
                    <span
                      className="text-xs max-w-20 text-center cursor-pointer hover:underline"
                      title="Double click to edit"
                      onDoubleClick={() => handleDoubleClick(folder)}
                    >
                      {folder.name}
                    </span>
                  )}
                </div>
              </li>
            ))
          ) : (
            <div className="mt-24">
            <p className="text-center text-lg text-gray-500 font-bold">Folder Not Found</p>
            </div>
          )}
        </ul>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              You want to Delete Folder "{selectedFolder?.name}" ?
            </h2>

            <div className="flex flex-col-reverse gap-2">
              {!loadingAction && (
                <button
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
              )}
              <button
                disabled={loadingAction}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                onClick={handleDeleteFolder}
              >
                <LoadingButton loading={loadingAction} text={"Delete"} />
              </button>
            </div>
          </div>
        </div>
      )}
      {modalAdd && (
        <ModalAddFolder
          isOpen={modalAdd}
          onClose={() => setModalAdd(false)}
          refresh={fetchdata}
        />
      )}
    </div>
  );
};

export default FolderList;
