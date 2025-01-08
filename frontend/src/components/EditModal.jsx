import React, { useState } from "react";

const EditModal = ({ row, onClose, onSave }) => {
  const [editedRow, setEditedRow] = useState({ ...row });

  const handleChange = (key, value) => {
    setEditedRow((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded shadow-lg w-full max-w-sm h-fit overflow-y-auto">
        <h3 className="text-md font-semibold mb-4">Edit Row</h3>
        {Object.entries(editedRow).map(([key, value]) => (
          <div key={key} className="mb-3">
            <label className="block font-medium">{key.toString().toUpperCase()}</label>
            <input
              type="text"
              value={value}
              onChange={(e) => handleChange(key, e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        ))}
        <div className="flex justify-end space-x-4">
          <button
            className="bg-gray-300 px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => onSave(editedRow)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
