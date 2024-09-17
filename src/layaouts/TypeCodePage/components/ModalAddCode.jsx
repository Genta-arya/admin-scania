import React, { useState } from "react";
import Modal from "../../../components/Modal";
import { handlePostType } from "../../../service/API/typeCode/_serviceType";
import { toast } from "sonner";
import handleError from "../../../utils/HandleError";
import LoadingButton from "../../../components/LoadingButton";

const ModalAddCode = ({ isModalOpen, closeModal ,refresh}) => {
  const [form, setForm] = useState({
    type: "",
    codes: [{ code: "", pdf: null }], // Set pdf as null initially
  });
  const [loading, setLoading] = useState(false);

  const handleAddCode = () => {
    setForm({
      ...form,
      codes: [...form.codes, { code: "", pdf: null }],
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.type);

      form.codes.forEach((code, index) => {
        formData.append(`codes[${index}].code`, code.code);
        if (code.pdf) {
          formData.append(`codes[${index}].pdf`, code.pdf);
        }
      });

      const response = await handlePostType(formData);
      if (response.message) {
        toast.success(response.message);
        refresh();
        closeModal();
      }
    } catch (error) {
      handleError(error);

    } finally{
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
