import React from 'react';

const SettingsModal = ({ isOpen, onClose, onThemeToggle, onLogout }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 w-screen">
      <div className="bg-background text-text rounded-lg shadow-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-4">Settings</h2>
        <div className="space-y-4">
          <button
            className="w-full bg-primary text-white px-4 py-2 rounded-md hover:"
            onClick={onThemeToggle}
          >
            Toggle Theme
          </button>
          <button
            className="w-full bg-destructive text-white px-4 py-2 rounded-md hover:"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
        <button
          className="mt-6 bg-secondary text-white px-4 py-2 w-full rounded-md hover:"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;