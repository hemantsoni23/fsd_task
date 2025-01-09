import { useState } from 'react';
import SettingsModal from './SettingsModal';

const Tabs = ({ activeTab, setActiveTab, handleLogout, handleThemeToggle }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
  <div className="flex flex-wrap justify-center items-center gap-4 mb-4">
    <div className="flex flex-wrap gap-2">
      <button
        className={`px-4 py-2 ${activeTab === "randomNumbers"
            ? "bg-primary text-white"
            : "bg-hover"
          } border rounded`}
        onClick={() => setActiveTab("randomNumbers")}
      >
        Random Numbers
      </button>
      <button
        className={`px-4 py-2 ${activeTab === "csvFile"
            ? "bg-primary text-white"
            : "bg-hover"
          } border rounded`}
        onClick={() => setActiveTab("csvFile")}
      >
        CSV File
      </button>
    </div>
    <button
      className="bg-secondary text-white px-4 py-2 font-medium text-lg rounded-md"
      onClick={()=>setIsSettingsOpen(true)}
    >
      Settings
    </button>
      {isSettingsOpen && (
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onThemeToggle={handleThemeToggle}
          onLogout={handleLogout}
        />
      )}
  </div>
)};

export default Tabs;
