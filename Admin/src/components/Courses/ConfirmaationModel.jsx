import React from "react";

export const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-xl p-6 shadow-lg w-[90%] md:w-1/3 text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{message}</h2>
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-300 text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded-md bg-red-500 text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
