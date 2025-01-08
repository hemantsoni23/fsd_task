const Tabs = ({ activeTab, setActiveTab, handleLogout }) => (
  <div className="flex flex-wrap justify-center items-center gap-4 mb-4">
    <div className="flex flex-wrap gap-2">
      <button
        className={`px-4 py-2 ${
          activeTab === "randomNumbers"
            ? "bg-accent text-white"
            : "bg-white text-accent"
        } border rounded`}
        onClick={() => setActiveTab("randomNumbers")}
      >
        Random Numbers
      </button>
      <button
        className={`px-4 py-2 ${
          activeTab === "csvFile"
            ? "bg-accent text-white"
            : "bg-white text-accent"
        } border rounded`}
        onClick={() => setActiveTab("csvFile")}
      >
        CSV File
      </button>
    </div>
    <button
      className="px-4 py-2 text-white bg-destructive font-medium text-lg rounded-md"
      onClick={handleLogout}
    >
      Logout
    </button>
  </div>
);

export default Tabs;
