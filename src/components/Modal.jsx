import React from "react";
import { FaTimes } from "react-icons/fa";
import { Toaster } from "sonner";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null; // Tidak render modal jika tidak dalam keadaan terbuka

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-gray-800 opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-white p-4 md:w-[60%] w-[90%] rounded shadow-lg relative z-10  ">
        <button
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <FaTimes />
        </button>
        {children}
      </div>
      <Toaster richColors position="top-center" />
    </div>
  );
};

export default Modal;
