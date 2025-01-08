const Tabs = ({ activeTab, setActiveTab, handleLogout }) => (
  <div className="flex flex-wrap justify-center items-center gap-4">
    <div className="flex flex-wrap gap-2">
      <button
        className={`px-4 py-2 ${
          activeTab === "randomNumbers"
            ? "bg-blue-500 text-white"
            : "bg-white text-blue-500"
        } border rounded`}
        onClick={() => setActiveTab("randomNumbers")}
      >
        Random Numbers
      </button>
      <button
        className={`px-4 py-2 ${
          activeTab === "csvFile"
            ? "bg-blue-500 text-white"
            : "bg-white text-blue-500"
        } border rounded`}
        onClick={() => setActiveTab("csvFile")}
      >
        CSV File
      </button>
    </div>
    <button
      className="px-4 py-2 text-white bg-red-400 font-medium text-lg rounded-md"
      onClick={handleLogout}
    >
      Logout
    </button>
  </div>
);

export default Tabs;
