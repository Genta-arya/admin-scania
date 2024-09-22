import React, { useEffect, useState } from "react";
import Button from "../../../components/Button";
import { FaEdit, FaPlus, FaTrash, FaSearch, FaFilePdf } from "react-icons/fa";
import ModalAddCode from "./ModalAddCode";
import {
  deleteCode,
  deleteType,
  handleGetType,
  handleRenameTypp,
} from "../../../service/API/typeCode/_serviceType";
import handleError from "../../../utils/HandleError";
import { toast } from "sonner";
import ModalEditCode from "./ModalEditCode";
import { useCodeStore } from "../../../utils/useCodeTypeStore";
import ModalAddNewCode from "./ModalAddNewCode";
import { deleteObject, getStorage, ref } from "@firebase/storage";
import app, { storage } from "../../../service/FirebaseConfig";
import { div } from "framer-motion/m";
import LoadingGlobal from "../../../components/Loading";

const TableTypeCode = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalAdd, setModalAdd] = useState(false);
  const { data, setData } = useCodeStore();
  const [editTypeId, setEditTypeId] = useState(null);
  const [editTypeName, setEditTypeName] = useState("");
  const [modalEditCode, setModalEditCode] = useState(false);
  const [modalAddCode, setModalAddCode] = useState(null);
  const [selectData, setSelectData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadings, setLoadings] = useState(true);
  const fetchData = async () => {
    try {
      const response = await handleGetType();
      setData(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoadings(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (item) => {
    setModalEditCode(true);
    setSelectData(item);
  };

  const handleDelete = async (codeId, pdfUrl) => {
    const storage = getStorage(app);
    try {
      setLoading(true);
      if (pdfUrl) {
        const decodedPdfUrl = decodeURIComponent(pdfUrl);
        const fileNameWithQuery = decodedPdfUrl.split("/").pop();
        const oldFileName = fileNameWithQuery.split("?")[0]; 

        await deleteObject(ref(storage, `pdfs/${oldFileName}`));

        await deleteCode(codeId);
        fetchData();
      }
      toast.success("Code deleted successfully.");
    } catch (error) {
    
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDoubleClick = (typeId, name) => {
    setEditTypeId(typeId);
    setEditTypeName(name);
  };

  const handleSaveEdit = async () => {
    if (editTypeName.trim() === "") {
      toast.info("Name cannot be empty.");
      return;
    }
    try {
      const response = await handleRenameTypp({
        typeId: editTypeId,
        name: editTypeName,
      });
      toast.success(response.message);
      fetchData();
      setEditTypeId(null);
      setEditTypeName("");
    } catch (error) {
      handleError(error);
    }
  };

  const handleCancel = () => {
    setEditTypeId(null);
    setEditTypeName("");
  };

  const handleDeleteType = async (typeId) => {
    const confirmation = window.confirm(
      "Deleting this type will also remove all associated codes. Are you sure you want to proceed?"
    );

    if (confirmation) {
      try {
        const response = await deleteType(typeId);
        toast.success(response.message);
        fetchData();
      } catch (error) {
        handleError(error);
      }
    }
  };
  if (loadings) {
    return <LoadingGlobal />;
  }

  return (
    <div className="w-screen md:px-4">
      <div className="mb-4 md:flex lg:flex gap-4 justify-between flex-grow px-2 lg:px-8 md:px-4">
        <div className="gap-2  flex w-full">
          <Button
            onClick={() => setModalAdd(true)}
            text="Add Type Code"
            width="md:w-auto lg:w-auto w-full"
            icon={<FaPlus />}
          />
          <Button
            onClick={() => setModalAddCode(true)}
            text="Add New Code"
            width="md:w-auto lg:w-auto w-full"
            icon={<FaPlus />}
          />
        </div>

        <div className=" ">
          <input
            type="text"
            placeholder="Search by type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="py-1.5 md:mt-0 lg:mt-0 mt-2 w-full  pl-4 border border-gray-300 rounded"
          />
        </div>
      </div>

      <div className="overflow-auto ">
        <table className="border  w-full overflow-auto  border-gray-300  ">
          <thead>
            <tr className="text-center text-xs">
              <th className="py-2 px-4 border-b">Type</th>
              <th className="py-2 px-4 border-b">Code</th>
              <th className="py-2 px-4 border-b">PDF</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-4 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            ) : (
              filteredData.map((item, typeIndex) =>
                item.codes.length === 0 ? (
                  <tr key={item.id}>
                    <td
                      className="py-4 text-center text-gray-500 "
                      onDoubleClick={() =>
                        handleDoubleClick(item.id, item.name)
                      }
                    >
                      {editTypeId === item.id ? (
                        <>
                          <div className="flex gap-2 text-xs">
                            <button
                              className=" text-red-500 ml-2"
                              title="Delete Type"
                              onClick={() => handleDeleteType(item.id)}
                            >
                              <FaTrash />
                            </button>
                            <input
                              type="text"
                              placeholder="Type"
                              value={editTypeName}
                              onChange={(e) => setEditTypeName(e.target.value)}
                              className="border border-gray-300 rounded px-2 py-1"
                            />
                            {editTypeName.trim() === "" ? (
                              <button
                                onClick={handleCancel}
                                className="ml-2 text-blue-500"
                              >
                                Cancel
                              </button>
                            ) : (
                              <button
                                onClick={handleSaveEdit}
                                className="ml-2 text-blue-500 text-sm"
                              >
                                Save
                              </button>
                            )}
                          </div>
                        </>
                      ) : (
                        <p className="cursor-pointer hover:underline">
                          {item.name}{" "}
                        </p>
                      )}
                    </td>
                    <td className="py-4 text-center text-gray-500">-</td>
                    <td className="py-4 text-center text-gray-500">-</td>
                    <td className="py-4 text-center text-gray-500">-</td>
                  </tr>
                ) : (
                  item.codes.map((codeItem, codeIndex) =>
                    codeItem ? (
                      <tr
                        key={`${item.id}-${codeItem.id}`}
                        className="text-center text-xs"
                      >
                        {/* Type */}
                        {codeIndex === 0 && (
                          <td
                            rowSpan={item.codes.length}
                            className="py-2 px-4 border-b"
                            onDoubleClick={() =>
                              handleDoubleClick(item.id, item.name)
                            }
                          >
                            {editTypeId === item.id ? (
                              <>
                                <div className="flex gap-2 ">
                                  <button
                                    className="ml-2 text-red-500"
                                    title="Delete Type"
                                    onClick={() => handleDeleteType(item.id)}
                                  >
                                    <FaTrash />
                                  </button>
                                  <input
                                    type="text"
                                    placeholder="Type"
                                    value={editTypeName}
                                    onChange={(e) =>
                                      setEditTypeName(e.target.value)
                                    }
                                    className="border border-gray-300 rounded px-2 py-1"
                                  />
                                  {editTypeName.trim() === "" ? (
                                    <button
                                      onClick={handleCancel}
                                      className="ml-2 text-blue-500"
                                    >
                                      Cancel
                                    </button>
                                  ) : (
                                    <button
                                      onClick={handleSaveEdit}
                                      className="ml-2 text-blue-500 text-sm"
                                    >
                                      Save
                                    </button>
                                  )}
                                </div>
                              </>
                            ) : (
                              <p className="cursor-pointer hover:underline">
                                {item.name}
                              </p>
                            )}
                          </td>
                        )}
                        {/* Code */}
                        <td className="py-2 px-4 border-b">{codeItem.code}</td>
                        {/* PDF */}
                        <td className="py-2 px-4 border-b">
                          <a
                            href={codeItem.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            <div className="flex items-center gap-2 justify-center">
                              <FaFilePdf className="text-red-500" />
                              <p>View PDF</p>
                            </div>
                          </a>
                        </td>
                        {/* Actions */}
                        <td className="py-2 px-4 border-b">
                          <div className="flex items-center md:flex-row lg:flex-row flex-col gap-2 justify-center">
                            <Button
                              onClick={() => handleEdit(codeItem)}
                              text="Edit"
                              icon={<FaEdit />}
                            />
                            <Button
                              onClick={() =>
                                handleDelete(codeItem.id, codeItem.pdfUrl)
                              }
                              loading={loading}
                              text="Delete"
                              bg="bg-red-500"
                              icon={<FaTrash />}
                            />
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <tr key={`${item.id}-${codeIndex}`}>
                        <td
                          colSpan="4"
                          className="py-4 text-center text-gray-500"
                        >
                          Code data is not available
                        </td>
                      </tr>
                    )
                  )
                )
              )
            )}
          </tbody>
        </table>
      </div>

      {modalAdd && (
        <ModalAddCode
          closeModal={() => setModalAdd(false)}
          isModalOpen={modalAdd}
          refresh={fetchData}
        />
      )}
      {modalEditCode && (
        <ModalEditCode
          closeModal={() => setModalEditCode(false)}
          isModalOpen={modalEditCode}
          data={selectData}
          refresh={fetchData}
        />
      )}
      {modalAddCode && (
        <ModalAddNewCode
          closeModal={() => setModalAddCode(false)}
          isModalOpen={modalAddCode}
          refresh={fetchData}
        />
      )}
    </div>
  );
};

export default TableTypeCode;
