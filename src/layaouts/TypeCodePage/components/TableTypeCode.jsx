import React, { useEffect, useState } from "react";
import Button from "../../../components/Button";
import { FaEdit, FaPlus, FaTrash, FaSearch, FaFilePdf } from "react-icons/fa";
import ModalAddCode from "./ModalAddCode";
import {
  handleGetType,
  handleRenameTypp,
} from "../../../service/API/typeCode/_serviceType";
import handleError from "../../../utils/HandleError";
import { toast } from "sonner";

const TableTypeCode = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalAdd, setModalAdd] = useState(false);
  const [data, setData] = useState([]);
  const [editTypeId, setEditTypeId] = useState(null);
  const [editTypeName, setEditTypeName] = useState("");

  const fetchData = async () => {
    try {
      const response = await handleGetType();
      setData(response.data);
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (typeId, codeId) => {
    alert(`Edit item with Type ID ${typeId} and Code ID ${codeId}`);
  };

  const handleDelete = (typeId, codeId) => {
    alert(`Delete item with Type ID ${typeId} and Code ID ${codeId}`);
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

  return (
    <div className="w-screen md:px-4">
      <div className="mb-4 md:flex lg:flex gap-4 justify-between flex-grow px-2 lg:px-8 md:px-4">
        <div className="md:block lg:block block ">
          <Button
            onClick={() => setModalAdd(true)}
            text="Add Type Code"
            width="w-full"
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
            {filteredData.map((item, typeIndex) =>
              item.codes.map((codeItem, codeIndex) => (
                <tr
                  key={`${item.id}-${codeItem.id}`}
                  className="text-center text-xs"
                >
                  {/* Nomor Baris */}

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
                          <input
                            type="text"
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
                              className="ml-2 text-blue-500"
                            >
                              Save
                            </button>
                          )}
                        </>
                      ) : (
                        item.name
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
                      className="text-blue-500 hover:underline"
                    >
                      <div className="flex items-center gap-2 justify-center">
                        <FaFilePdf className="text-red-500" />
                        <p>View PDF</p>
                      </div>
                    </a>
                  </td>
                  {/* Actions */}
                  <td className="py-2 px-4 border-b -">
                    <div className="flex   items-center md:flex-row lg:flex-row flex-col gap-2 justify-center">
                      <Button
                        onClick={() => handleEdit(item.id, codeItem.id)}
                        text="Edit"
                        icon={<FaEdit />}
                      />
                      <Button
                        onClick={() => handleDelete(item.id, codeItem.id)}
                        text="Delete"
                        bg="bg-red-500"
                        icon={<FaTrash />}
                      />
                    </div>
                  </td>
                </tr>
              ))
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
    </div>
  );
};

export default TableTypeCode;
